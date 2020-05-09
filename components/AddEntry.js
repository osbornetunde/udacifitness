import React, { useState} from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import { Ionicons } from '@expo/vector-icons';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';
import { addEntry, receiveEntries } from '../actions';
import { white, purple } from '../utils/colors'
import { CommonActions } from '@react-navigation/native';



const SubmitButton = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress} 
            style={Platform.os === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn }
        >
            <Text style={styles.submitBtnText}>submit</Text>
        </TouchableOpacity>
    )
}


const AddEntry = ({ addEntry, receiveEntries, alreadyLogged, navigation}) => {
     
     const [item, setItem] = useState({
         run: 0,
         bike: 0,
         swim: 0,
         sleep: 0,
         eat:0,
     })
    

     const increment = (metric) => {
         const { max, step } = getMetricMetaInfo(metric)
         setItem((item) => {
             const count = item[metric] + step
             
             return ({
                 ...item,
                 [metric]: count > max ? max : count
             })
        })
     }

    const decrement = (metric) => {
       
        setItem((item) => {
            const count = item[metric] - getMetricMetaInfo(metric).step
            
            return ({
                ...item,
                [metric]: count < 0 ? 0 : count
            })
        })
         
    }
     
     const slide = (metric, value) => {
         setItem(() => ({
            [metric]: value
        }))
     }

     const submit = () => {
         const key = timeToString()
         const entry = item

         setItem(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat:0,
         }))

         addEntry({
             [key]: entry
         })
         toHome()
         submitEntry({entry, key})
         

     }

     const toHome = () => {
        navigation.dispatch(
            CommonActions.goBack({
                key: 'AddEntry',
            }))
    }
    
    const reset = () => {
        const key = timeToString()
        addEntry({
            [key]: getDailyReminderValue()
        })
         toHome()
         removeEntry(key)
         //Clear local notification
    }

     const metaInfo = getMetricMetaInfo()


     if (alreadyLogged) {
         return (
             <View style={styles.center}>
                 <Ionicons
                     name={Platform.os === 'ios' ? "ios-happy" : "md-happy"}
                     size={100}
                     />
                 <Text>You already logged your Information for today</Text>
                 <TextButton style={{padding: 10}} onPress={reset}>
                 Reset
                 </TextButton>
             </View>
         )
     }

    return (
        <View style={styles.container}>
            <DateHeader date={(new Date()).toLocaleDateString()} />
                {Object.keys(metaInfo).map(key => {
                    const { getIcon, type, ...rest } = metaInfo[key]
                    const value = item[key]
                    return (
                        <View key={key} style={styles.row}>
                            {getIcon()}
                            {type === "slider"
                                ? <UdaciSlider
                                    value={value}
                                    onChange={(value) => slide(key, value)}
                                    {...rest}
                                /> :
                                <UdaciSteppers
                                    value={value}
                                    onIncrement={() => increment(key)}
                                    onDecrement={() => decrement(key)}
                                    {...rest}
                                />
                            }
                            
                        </View>
                    )
                })

                }
        <SubmitButton onPress={submit}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white,

    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        borderRadius: 7,
        padding: 10,
        height: 45,
        marginLeft: 40,
        marginRight: 40,
    },
    androidSubmitBtn: {
        backgroundColor: purple,
        borderRadius: 2,
        padding: 10,
        height: 45,
        paddingLeft: 30,
        paddingRight: 30,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems:'center'
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center',
        marginLeft: 30,
        marginRight: 40,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
 
const mapStateToProps = state => {
    const key = timeToString()


    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}

 export default connect(mapStateToProps, { addEntry, receiveEntries})(AddEntry)