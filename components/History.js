import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Platform, TouchableOpacity} from "react-native";
import { connect } from "react-redux";
import { AppLoading } from 'expo';
import UdaciFitnessCalendar from 'udacifitness-calendar';
import {receiveEntries, addEntry} from "../actions";
import {timeToString, getDailyReminderValue} from "../utils/helpers";
import { fetchCalendarResult } from "../utils/api";
import { white } from '../utils/colors';
import DateHeader from './DateHeader';
import MetricCard from './MetricCard';

const History = ({ receiveEntries, addEntry, entries, navigation }) => {
    
    const [ready, setReady] = useState(false)
  useEffect(() => {
    fetchCalendarResult()
      .then((entries) => receiveEntries(entries))
      .then((entries) => {
        if (!entries[timeToString()]) {
          addEntry({
            [timeToString()]: getDailyReminderValue(),
          });
        }
      })
      .then(() => setReady(true))
  }, []);

  const renderItem = ({today, ...metrics}, formattedDate, key) => (
    <View style={styles.item}>
      {today ? (
              <View>
                  <DateHeader date={formattedDate} />
                  <Text style={styles.noDataText}>
                  {today}
                  
                  </Text>
              </View>
      ) : (
                  <TouchableOpacity onPress={() => navigation.navigate('EntryDetail', { entryId: key})}>
                      <MetricCard metrics={metrics} date={formattedDate}/>
                  
                  </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyDate = (formattedDate) => (
      <View style={styles.item}>
          <DateHeader date={formattedDate} />
          <Text style={styles.noDataText}>
          
          You didn't log any data on this day
          </Text>
    </View>
  );

  return (
    
       ready === false ? <AppLoading /> :
          <UdaciFitnessCalendar
        items={entries}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
      />
   
  );
};

const mapStateToProps = (entries) => ({
  entries,
});

export default connect(mapStateToProps, {receiveEntries, addEntry})(History);

const styles = StyleSheet.create({

    item: {
        backgroundColor: white,
        borderRadius: Platform.os === "ios" ? 16 : 2,
        padding: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 17,
        justifyContent: 'center',
        shadowRadius: 3,
        shadowOpacity: 0.8,
        shadowColor: 'rgba(0,0,0,0.24)',
        shadowOffset: {
            width: 0,
            height: 3
        }
    },
    noDataText: {
        fontSize: 20,
        paddingBottom: 20,
        paddingTop: 20,
    }
})