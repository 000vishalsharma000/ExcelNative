import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const App = () => {
  const [grid, setGrid] = useState(Array(5).fill(Array(5).fill('')));

  useEffect(() => {
    const loadGridFromStorage = async () => {
      try {
        const storedGrid = await AsyncStorage.getItem('grid');
        if (storedGrid !== null) {
          setGrid(JSON.parse(storedGrid));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadGridFromStorage();
  }, []);

  useEffect(() => {
    const saveGridToStorage = async () => {
      try {
        await AsyncStorage.setItem('grid', JSON.stringify(grid));
      } catch (error) {
        console.error(error);
      }
    };

    saveGridToStorage();
  }, [grid]);

  const handleTextChange = (text, rowIdx, colIdx) => {
    const newGrid = [...grid];
    newGrid[rowIdx][colIdx] = text;
    setGrid(newGrid);
  };

  const handleDownload = async () => {
    const csv = grid.map(row => row.join(',')).join('\n');
    const path = FileSystem.documentDirectory + 'grid.csv';
    console.log(path)
    await FileSystem.writeAsStringAsync(path, csv);
    alert(`CSV file has been saved at ${path}`);
  };

  return (
    <View style={styles.container}>
      <Button title="Download as CSV" onPress={handleDownload} />
      {grid.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((cell, colIdx) => (
            <TextInput
              key={colIdx}
              style={styles.cell}
              onChangeText={(text) => handleTextChange(text, rowIdx, colIdx)}
              value={cell}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
});

export default App;
