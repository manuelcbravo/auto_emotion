import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('../../assets/images/logo_simple.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 150,
    marginBottom: 8,
    marginTop: 0,
  },
})
