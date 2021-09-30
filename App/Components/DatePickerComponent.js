import React, { Component } from 'react'
import { View, Text, TextInput } from 'react-native'
import styles from './Styles/DatePickerComponentStyle'
import DatePicker from 'react-native-datepicker'
import { Images } from '../Themes'
import moment from 'moment'

export default class DatePickerComponent extends Component {
  render () {
    const { disabled, margin, placeholderTextStyle, titleStyle, dateInputStyle, minDate, maxDate, format } = this.props

    return (
      <View style={[styles.container, {marginLeft: margin === 'left' ? 10 : 0,
        marginRight: margin !== 'left' ? 10 : 0}]}>
        <Text style={{...styles.text, ...titleStyle}}>{this.props.title}</Text>
        {
          !disabled &&
          <DatePicker
            style={styles.datePcker}
            minDate={minDate}
            maxDate={maxDate}
            // minuteInterval={15} // only work in iOS
            date={this.props.date}
            mode={this.props.mode}
            androidMode="spinner"
            placeholder={this.props.placeholder}
            format={this.props.format}
            confirmBtnText='Confirm'
            cancelBtnText='Cancel'
            iconSource={Images.caretIcon}
            customStyles={{
              dateIcon: styles.dateIcon,
              dateInput: {...styles.dateInput, ...dateInputStyle},
              dateText: styles.dateText,
              placeholderText: {...styles.placeholderText, ...placeholderTextStyle}
            }}
            onDateChange={(_, date) => { this.props.onDateChange(date) }}
          />
        }
        {
          disabled &&
          <TextInput
            style={styles.textInput}
            value={moment(this.props.date).format(this.props.mode === 'time' ? 'HH:mm' : this.props.format)}
            editable={false}
          />
        }

      </View>
    )
  }
}
