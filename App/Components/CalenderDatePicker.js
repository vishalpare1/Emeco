import moment from "moment";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, View, StyleSheet, Text, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";

const ScreenHeight = Dimensions.get("screen").height;
const CalenderDuration = 300;

/**
 * @typedef CalendarDatePickerProps
 * @property {string} startingDay
 * @property {string} endingDay
 * @property {boolean} visible
 * @property {() => void} [onCancel]
 * @property {(startDate: string, endDate: string) => void} [onDatesChange]
 */

/**
 * @type {React.FunctionComponent<CalendarDatePickerProps>}
 */

const CalendarDatePicker = (props) => {
  const [resetCounter, setResetCounter] = useState(0);
  const editDayRef = useRef("startingDay");
  const [startingDay, setStartingDay] = useState(props.startingDay);
  const [endingDay, setEndingDay] = useState(props.endingDay);
  const translateY = useRef(new Animated.Value(ScreenHeight)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { visible } = props;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: CalenderDuration,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: CalenderDuration,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: ScreenHeight,
          duration: CalenderDuration,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: CalenderDuration,
          useNativeDriver: false,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  let markedDates = useMemo(() => {
    if (startingDay && !endingDay) {
      return {
        [startingDay]: {
          startingDay: true,
          endingDay: true,
          color: "#88FF88",
        },
      };
    } else if (startingDay && endingDay) {
      let result = {};
      let sd = moment(startingDay, 'Y-MM-DD');
      let ed = moment(endingDay, 'Y-MM-DD');
      let i = sd.clone();
      while(i.diff(ed) <= 0) {
        result[i.format('Y-MM-DD')] = {
          startingDay: i.diff(sd) === 0,
          endingDay: i.diff(ed) === 0,
          color: "#88FF88",
        };
        i = i.add(1, 'day');
      }
      return result;
    } else {
      return {};
    }
  }, [startingDay, endingDay]);

  useEffect(() => setStartingDay(props.startingDay), [props.startingDay]);

  useEffect(() => setEndingDay(props.endingDay), [props.endingDay]);

  const reset = useCallback(() => {
    setResetCounter((v) => v + 1);
    setStartingDay(null);
    setEndingDay(null);
    editDayRef.current = 'startingDay';
  }, []);

  function onPressDone() {
    props?.onDatesChange(startingDay, endingDay ?? startingDay);
  }

  return (
    <View style={styles.pickerModalContainer} pointerEvents="box-none">
      <Animated.View
        style={[styles.background, { opacity }]}
        pointerEvents={visible ? "auto" : "none"}
      />
      <Animated.View style={[{ transform: [{ translateY: translateY }] }]}>
        <View style={styles.calenderContainer}>
          <View style={styles.toolbar}>
            <Text
              style={[styles.toolbarItem, styles.cancelItem]}
              onPress={() => {
                reset();
                props?.onCancel();
              }}
            >
              Clear filter
            </Text>
            <Text
              style={[styles.toolbarItem, styles.doneItem]}
              onPress={onPressDone}
            >
              Done
            </Text>
          </View>
          <Calendar
            key={`c_${resetCounter}`}
            onDayPress={(dateObj) => {
              switch (editDayRef.current) {
                case "startingDay":
                  setStartingDay(dateObj.dateString);
                  if (endingDay) {
                    setEndingDay(null);
                  }
                  editDayRef.current = 'endingDay';
                  break;
                case "endingDay":
                  setEndingDay(dateObj.dateString);
                  editDayRef.current = 'startingDay';
                  break;
              }
            }}
            markingType="period"
            markedDates={markedDates}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default CalendarDatePicker;

const styles = StyleSheet.create({
  pickerModalContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
  },
  background: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  toolbar: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
  },
  toolbarItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  cancelItem: {
    color: "red",
  },
  doneItem: {
    color: "#0088FF",
  },
  calenderContainer: {
    backgroundColor: "white",
    paddingBottom: 50,
  },
});
