import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { white } from '../utils/colors'
import MetricCard from './MetricCard'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api';
import { timeToString, getDailyReminderValue } from '../utils/helpers';
import TextButton from './TextButton';


const EntryDetail = (props) => {

    const { metrics } = props

    

    const setTitle = (entryId) => {
        if (!entryId) return;

        const year = entryId.slice(0, 4)
        const month = entryId.slice(5, 7)
        const day = entryId.slice(8)

        props.navigation.setOptions( {
            title: `${month}/${day}/${year}`
        })
    }

    const reset = () => {
        const { goBack, remove, entryId } = props
        
        remove()
        goBack()
        removeEntry(entryId)
    }
    const entryId = props.route.params.entryId
    setTitle(entryId)
    return (
        metrics !== null && !metrics.today &&
        <View style={styles.container}>
            <MetricCard metrics={metrics}/>
            <TextButton onPress={reset} style={{margin: 20}}>
            Reset
            </TextButton>
        </View>
        
    )
}


const mapStateToProps = (state, { route }) => {
    const { entryId } = route.params

    return {
        entryId,
        metrics: state[entryId]
    }
}

const mapDispatchToProps = (dispatch,{ navigation, route }) => {
    const { entryId } = route.params

    return {
        remove: () => dispatch(addEntry({
            [entryId]: timeToString() === entryId ? getDailyReminderValue() : null
        })),
        goBack: () => navigation.goBack()
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: white,
        padding: 15,
    }
})