import React, { Component } from 'react';
import {
  Text,
  ListView,
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
	Keyboard,
	Image,
	Platform
} from 'react-native';
import { Images } from '../../App/Themes';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const defaultItemValue = {
  name: '',
  id: 0
};

export default class SearchableDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      listItems: [],
      focus: false,
      resetValue: false
    };
  }

  renderList = () => {
    if (this.state.focus) {
      return (
        <ListView
          style={{ ...this.props.itemsContainerStyle }}
          keyboardShouldPersistTaps="always"
          dataSource={ds.cloneWithRows(this.state.listItems)}
          renderRow={this.renderItems}
        />
      );
    }
  };

  renderFlatList = () => {

    if (this.state.focus) {

      return (
        <FlatList
          style={{ ...this.props.itemsContainerStyle }}
          keyboardShouldPersistTaps="always"
          data={this.state.listItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderItems(item)}
          ref={ref => this.flatList = ref}
        />
      );
    }
  };

  componentDidMount = () => {
    const listItems = this.props.items;
    const defaultIndex = this.props.defaultIndex;

    if (defaultIndex && listItems.length > defaultIndex) {
      this.setState({
        listItems,
        item: listItems[defaultIndex]
      });
    } else {
      this.setState({ listItems });
    }

    this.setState({
      resetValue: this.props.resetValue
    })
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.items && nextProps.items !== this.props.items) {
      let searchedText = (this.state.resetValue ? '' :  this.state.item.name) || ''
      this.searchedItems(searchedText, nextProps.items)
    }
  }

  searchedItems = (searchedText, items = this.props.items) => {
    var ac = items.filter(function(item) {
      return item.name.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
    });
    let item = {
      id: -1,
      name: searchedText
    };
    this.setState({ listItems: ac, item: item });
    const onTextChange = this.props.onTextChange;

    if (onTextChange && typeof onTextChange === 'function') {
      setTimeout(() => {
        onTextChange(searchedText);
      }, 0);
    }

    this.setState({
      resetValue: false
    })
  };

  renderItems = item => {
    return (
      <TouchableOpacity
        style={{ ...this.props.itemStyle }}
        onPress={() => {
          this.setState({ item: item, focus: false });
          Keyboard.dismiss();
          setTimeout(() => {
            this.props.onItemSelect(item);

            if (this.props.resetValue) {
              this.setState({ focus: true, item: defaultItemValue });
              this.input.focus();
            }
          }, 0);

          this.setState({
            resetValue: true
          })
        }}
      >
        <Text style={{ ...this.props.itemTextStyle }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  renderListType = () => {
    return this.props.listType == 'ListView'
      ? this.renderList()
      : this.renderFlatList();
  };

	onStartShouldSetResponderCapture() {
		let { setEnableScrollViewScrollState } = this.props

		Platform.OS == 'android' && setEnableScrollViewScrollState(false)
	}

  render = () => {
    return (
      <View
        keyboardShouldPersist="always"
        style={{ ...this.props.containerStyle, borderBottomColor: '#999999', borderBottomWidth: 1 }}
      >
				<View>
					<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1}}>
						<TextInput
							ref={e => (this.input = e)}
							underlineColorAndroid={this.props.underlineColorAndroid}
							onFocus={(event: Event) => {
								this.setState({
									focus: true,
									item: defaultItemValue,
									listItems: this.props.items
								});
                this.props.onFocus(event)
							}}
							onBlur={() => {
								this.setState({
									focus: false
								});
							}}
							onChangeText={text => {
								this.searchedItems(text);
							}}
							value={this.state.resetValue ? '' :  this.state.item.name}
							style={{ ...this.props.textInputStyle }}
							placeholderTextColor={this.props.placeholderTextColor}
							placeholder={this.props.placeholder}
              autoCompleteType="off"
							autoCorrect={false}
							multiline = {this.props.multiline}
							numberOfLines = {this.props.numberOfLines}
						/>
					</View>
						<View style={{justifyContent: 'center'}}>
							<TouchableOpacity onPress={(event: Event) => {
								this.setState({
									focus: true,
									item: defaultItemValue,
									listItems: this.props.items
								});
                this.props.onFocus(event)
							}}>
								<Image source={Images.caretIcon} />
							</TouchableOpacity>
						</View>
					</View>

					<View onStartShouldSetResponderCapture={() => this.onStartShouldSetResponderCapture()}>
						{this.renderListType()}
					</View>
				</View>
			</View>
    );
  };
}
