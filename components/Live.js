import React, {useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Foundation } from '@expo/vector-icons';
import { purple, white } from '../utils/colors'


const Live = () => {
    const [item, setItem] = useState({
        coords: null,
        status: 'denied',
        direction: ''
    })

    const askPermission = () => {

    }
    const renderView = () => {
        if (item.status === null) {
            return <ActivityIndicator style={{marginTop: 30}}/>
        }
        if (item.status === 'denied') {
            return (
                <View style={styles.center}>
                    < Foundation name="alert" size={50} />
                    <Text>
                    You denied your location. You can fix this by going to settings and enabling your location services for this app.
                    </Text>
                </View>
            )
        }
        if (item.status === 'undetermined') {
            return (
                <View style={styles.center}>
                    < Foundation name="alert" size={50} />
                    <Text>
                        You need to enable location services for this app.
                    </Text>
                    <TouchableOpacity onPress={askPermission} style={styles.button}>
                        <Text style={styles.buttonText}>
                        Enable
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View>
                <Text>Live</Text>
                <Text>{JSON.stringify(item)}</Text>
            </View>
        )
}

    return (
        renderView()
    )
}

export default Live;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between'
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 30,
      marginRight: 30,
    },
    button: {
      padding: 10,
      backgroundColor: purple,
      alignSelf: 'center',
      borderRadius: 5,
      margin: 20,
    },
    buttonText :{
      color: white,
      fontSize: 20,
    }
  })