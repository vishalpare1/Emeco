import React, {FunctionComponent} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import { Colors, Fonts } from '../Themes';

type SegmentedControlProps = {
  items: string[],
  value: string,
  onSelect: ((value: string) => void),
};

const SegmentedControl: FunctionComponent<SegmentedControlProps> = props => {
  return (
    <View style={styles.itemsContainer}>
      {
        props.items.map((item, index) => {
        let selected = props.value === item;
        return (
          <View
            key={`${index}`}
            style={[styles.item, selected && styles.selectedItem]}>
            <Text
              style={[styles.itemText, selected && styles.selectedItemText]}
              onPress={() => props.onSelect && props.onSelect(item)}>
              {item}
            </Text>
          </View>
        );
      })
      }
    </View>);
};

SegmentedControl.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onSelect: PropTypes.func,
};

export default SegmentedControl;

const styles = StyleSheet.create({
  itemsContainer: {
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'white',
  },
  item: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  itemText: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.medium,
    color: Colors.darkGray,
  },
  selectedItem: {
    backgroundColor: 'transparent'
  },
  selectedItemText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
