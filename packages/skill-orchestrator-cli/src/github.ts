import { CatalogManifestSchema, type RemoteCatalog } from './types.js';

const DEFAULT_SOURCE_REPO = process.env.SKILLS_SOURCE_REPO || 'mariojgmaster/GPT-CODEX-SKILLs';
const GITHUB_API = 'https://api.github.com';
const RAW_GITHUB = 'https://raw.githubusercontent.com';
const CODELOAD = 'https://codeload.github.com';

type FetchLike = typeof fetch;

function getAuthHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
}

async function requestJson<T>(url: string, fetchImpl: FetchLike): Promise<T> {
  const response = await fetchImpl(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': '@mariojgmaster/skill-orchestrator',
      ...getAuthHeaders()
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `GitHub API request failed (404). Confirm that the source repository exists and is public, or provide GITHUB_TOKEN/GH_TOKEN for private access. URL: ${url}`
      );
    }
    throw new Error(`GitHub API request failed (${response.status}): ${url}`);
  }

  return (await response.json()) as T;
}

async function requestText(url: string, fetchImpl: FetchLike): Promise<string> {
  const response = await fetchImpl(url, {
    headers: {
      'User-Agent': '@mariojgmaster/skill-orchestrator',
      ...getAuthHeaders()
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Remote file request failed (404). Confirm that the source repository exists and is public, or provide GITHUB_TOKEN/GH_TOKEN for private access. URL: ${url}`
      );
    }
    throw new Error(`Remote file request failed (${response.status}): ${url}`);
  }

  return response.text();
}

async function requestBuffer(url: string, fetchImpl: FetchLike): Promise<Buffer> {
  const response = await fetchImpl(url, {
    headers: {
      'User-Agent': '@mariojgmaster/skill-orchestrator',
      ...getAuthHeaders()
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Archive download failed (404). Confirm that the source repository exists and is public, or provide GITHUB_TOKEN/GH_TOKEN for private access. URL: ${url}`
      );
    }
    throw new Error(`Archive download failed (${response.status}): ${url}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

export class GitHubCatalogSource {
  constructor(
    private readonly repoFullName = DEFAULT_SOURCE_REPO,
    private readonly fetchImpl: FetchLike = fetch
  ) {}

  async resolve(): Promise<RemoteCatalog> {
    const [owner, repo] = this.repoFullName.split('/');
    if (!owner || !repo) {
      throw new Error(`Invalid GitHub repo "${this.repoFullName}"`);
    }

    const repoInfo = await requestJson<{ default_branch: string }>(
      `${GITHUB_API}/repos/${owner}/${repo}`,
      this.fetchImpl
    );

    const commit = await requestJson<{ sha: string }>(
      `${GITHUB_API}/repos/${owner}/${repo}/commits/${repoInfo.default_branch}`,
      this.fetchImpl
    );

    const manifestText = await requestText(
      `${RAW_GITHUB}/${owner}/${repo}/${commit.sha}/catalog.manifest.json`,
      this.fetchImpl
    );

    const manifest = CatalogManifestSchema.parse(JSON.parse(manifestText));

    return {
      repoFullName: this.repoFullName,
      owner,
      repo,
      defaultBranch: repoInfo.default_branch,
      sha: commit.sha,
      manifest,
      downloadArchive: async () =>
        requestBuffer(`${CODELOAD}/${owner}/${repo}/zip/${commit.sha}`, this.fetchImpl)
    };
  }
}
