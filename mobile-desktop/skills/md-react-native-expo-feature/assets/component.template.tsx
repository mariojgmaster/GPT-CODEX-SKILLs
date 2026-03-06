import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type {ComponentName}Props = {
  label: string;
};

export function {ComponentName}({ label }: {ComponentName}Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12
  },
  label: {
    fontSize: 16
  }
});

