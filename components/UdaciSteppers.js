import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons'


export default function UdaciStepper({ max, unit, step, value, onDecrement, onIncrement}) {
    return (
        <View>
        <View>
            <TouchableOpacity onPress={onDecrement}>
                <FontAwesome name="minus" size={30} colour={'black'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={onIncrement}>
                <FontAwesome name="plus" size={30} colour={'black'}/>
            </TouchableOpacity>
            </View>
            <View>
                <Text>{value}</Text>
                <Text>{unit}</Text>
            </View>
        </View>
    )
}