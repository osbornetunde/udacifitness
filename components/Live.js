import React, {useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions'
import { Foundation } from '@expo/vector-icons';
import { purple, white } from '../utils/colors'
import  {  calculateDirection } from '../utils/helpers'




const Live = () => {
    const [coords, setCoords] = useState(null)
    const [status, setStatus] = useState(null)
    const [direction, setDirection] = useState("")
    const [bounceValue, setBounceValue] = useState(new Animated.Value(1))

    useEffect(() => {
        Permissions.getAsync(Permissions.LOCATION)
            .then(({ status }) => {
                if (status === 'granted') {
                return setLocation()
                }
                setStatus(status)
            })
            .catch((error) => {
                console.warn("Error getting Location permission", error)
                setStatus("undetermined")
        })
})

    const askPermission = () => {
        Permissions.askAsync(Permissions.LOCATION)
        .then(({status}) => {
            if (status === 'granted') {
                return setLocation()
            }
            setStatus(status)
        })
        .catch((err) => console.warn(err))

        
    }

    setLocation = () => {
        Location.watchPositionAsync({
            enableHighAccuracy: true,
            timeInterval: 1,
            distanceInterval: 1
        }, ({ coords }) => {
                const newDirection = calculateDirection(coords.heading)
                setCoords(coords)
                setStatus("granted")
                setDirection(newDirection)
                if (newDirection !== direction) {
                    Animated.sequence([
                        Animated.timing(bounceValue, { duration: 200, toValue: 1.04 }),
                        Animated.spring(bounceValue, {toValue: 1, friction: 4}),
                    ]).start()
                }
        })
    }
    const renderView = () => {
        if (status === null) {
            return <ActivityIndicator style={{marginTop: 30}}/>
        }
        if (status === 'denied') {
            return (
                <View style={styles.center}>
                    < Foundation name="alert" size={50} />
                    <Text>
                    You denied your location. You can fix this by going to settings and enabling your location services for this app.
                    </Text>
                </View>
            )
        }
        if (status === 'undetermined') {
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
            <View style={styles.container}>
                <View style={styles.directionContainer}>
                    <Text style={styles.header}>You are heading</Text>
                    <Animated.Text style={[styles.direction, {transform:[{scale: bounceValue}]}]}>{direction}</Animated.Text>
                </View>
                <View style={styles.metricContainer}>
                    <View style={styles.metric}>
                        <Text style={[styles.header, { color: white }]}>
                        Altitude
                    </Text>
                    <Text style={[styles.subHeader , { color: white }]}>
                    {Math.round(coords.altitude * 3.2808)} Feet
                    </Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={[styles.header, { color: white }]}>
                        Speed
                    </Text>
                    <Text style={[styles.subHeader , { color: white }]}>
                    {(coords.speed * 2.2369).toFixed(1)} MPH
                    </Text>
                    </View>
                </View>
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
    },
    directionContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      header: {
        fontSize: 35,
        textAlign: 'center',
      },
      direction: {
        color: purple,
        fontSize: 120,
        textAlign: 'center',
      },
      metricContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: purple,
      },
      metric: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
      },
      subHeader: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 5,
      }
  })