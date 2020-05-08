import React, {useEffect} from "react";
import {View, Text} from "react-native";
import {connect} from "react-redux";
import UdaciFitnessCalendar from 'udacifitness-calendar';
import {receiveEntries, addEntry} from "../actions";
import {timeToString, getDailyReminderValue} from "../utils/helpers";
import {fetchCalendarResult} from "../utils/api";

const History = ({receiveEntries, addEntry, entries}) => {
  useEffect(() => {
    fetchCalendarResult()
      .then((entries) => receiveEntries(entries))
      .then((entries) => {
        if (!entries[timeToString()]) {
          addEntry({
            [timeToString()]: getDailyReminderValue(),
          });
        }
      });
  }, []);

  const renderItem = ({today, ...metrics}, formattedDate, key) => (
    <View>
      {today ? (
        <Text>{JSON.stringify(today)}</Text>
      ) : (
        <Text>{JSON.stringify(metrics)}</Text>
      )}
    </View>
  );

  const renderEmptyDate = (formattedDate) => (
    <View>
      <Text>No Data for this day</Text>
    </View>
  );

  return (
    <View>
      <UdaciFitnessCalendar
        items={entries}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
      />
    </View>
  );
};

const mapStateToProps = (entries) => ({
  entries,
});

export default connect(mapStateToProps, {receiveEntries, addEntry})(History);
