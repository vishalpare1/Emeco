import React, { Component } from 'react'

import { Image, Switch, Text, TextInput, View, StyleSheet } from 'react-native'
import Fonts from '../Themes/Fonts'
import Colors from '../Themes/Colors'
import SignatureCapture from 'react-native-signature-capture'

export default class FieldServiceComponent extends Component {
	constructor (props) {
		super(props)
		this.sign = React.createRef()
	}

	saveSign () {
		this.sign.current.saveImage()
	}

	resetSign () {
		this.sign.current.resetImage()
	}

	onSaveEvent = (result) => {
		const { onChangeCustomerAcceptance } = this.props

		onChangeCustomerAcceptance(`data:image/png;base64,${result.encoded}`)
	}

	signatureExists = (customerAcceptance) => {
		if (typeof customerAcceptance === 'string') {
			return true
		} else {
			return typeof customerAcceptance?.url === 'string'
		}
	}

	extractSignature = (customerAcceptance) => {
		if (typeof customerAcceptance === 'string') {
			return customerAcceptance
		} else if (typeof customerAcceptance?.url === 'string') {
			return customerAcceptance?.url
		}
	}

	render () {
		const {
			task,
			isEditable,
			onChangeFieldService,
			onChangeFieldServiceNotes,
			onChangeCustomerAcceptance
		} = this.props

		return (
			<>
				<View style={styles.row}>
					<Text style={styles.heading}>
						Field Service
					</Text>
					<Switch
						value={task.fieldService ?? false}
						onValueChange={(updated) => onChangeFieldService(updated)}
						disabled={!isEditable}
					/>
				</View>
				{task.fieldService && (
					<View style={{ minHeight: 350 }}>
						<View style={{
							flex: 1,
							paddingLeft: 3,
							marginTop: 18,
						}}>
							<Text style={{
								...Fonts.style.small,
								color: 'rgba(255, 255, 255, 0.5)'
							}}>
								FIELD SERVICE NOTES
							</Text>
							<TextInput
								style={styles.notes}
								value={task.fieldServiceNotes}
								placeholder={'Enter notes'}
								placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
								keyboardType={'default'}
								multiline={true}
								maxLength={8000}
								editable={isEditable}
								onChangeText={(text) => onChangeFieldServiceNotes(text)}
							/>
						</View>
						<View style={styles.customerAcceptance}>
							<View style={{
								flexDirection: 'row',
								justifyContent: 'space-between'
							}}>
								<Text style={styles.customerAcceptanceHeading}>
									CUSTOMER ACCEPTANCE
								</Text>
							</View>
							{isEditable ? (
								<>
									{this.signatureExists(task.customerAcceptanceSignature) ? (
										<Image
											source={{ uri: this.extractSignature(task.customerAcceptanceSignature) }}
											style={styles.signatureImage}
										/>
									) : (
										<SignatureCapture
											style={styles.signature}
											ref={this.sign}
											onSaveEvent={this.onSaveEvent}
											saveImageFileInExtStorage={false}
											showNativeButtons={false}
											showTitleLabel={false}
											backgroundColor={Colors.white}
											strokeColor={Colors.panther}
											minStrokeWidth={4}
											maxStrokeWidth={4}
											viewMode={'portrait'}/>
									)}
								</>
							) : (
								<Image
									source={{ uri: task.customerAcceptanceSignature.url }}
									style={styles.signatureImage}
								/>
							)
							}
							{isEditable && (
								<View style={{
									flexDirection: 'row',
									justifyContent: 'space-between'
								}}>
									{this.signatureExists(task.customerAcceptanceSignature) ? (
										<>
											<Text></Text>
											<Text onPress={() => onChangeCustomerAcceptance(null)} style={styles.reset}>
												Clear
											</Text>
										</>
									) : (
										<>
											<Text onPress={() => this.saveSign()} style={styles.save}>
												Save
											</Text>
											<Text onPress={() => this.resetSign()} style={styles.reset}>
												Clear
											</Text>
										</>
									)}
								</View>
							)}
						</View>
					</View>
				)}
			</>
		)
	}
}

const styles = StyleSheet.create({
	row: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	heading: {
		...Fonts.style.fontWeight600,
		color: 'rgba(255, 255, 255, 0.5)',
		borderBottomColor: Colors.snow,
		borderBottomWidth: 0.5,
		paddingLeft: 3
	},
	notes: {
		height: 100,
		borderWidth: 1,
		marginTop: 18,
		borderColor: 'rgba(255, 255, 255, 0.5)',
		borderBottomColor: 'rgba(255, 255, 255, 0.5)',
		color: Colors.snow,
		...Fonts.style.fontWeight600,
		paddingLeft: 5
	},
	customerAcceptance: {
		marginTop: 18,
		marginLeft: 3,
		height: 200
	},
	customerAcceptanceHeading: {
		...Fonts.style.small,
		color: 'rgba(255, 255, 255, 0.5)',
		marginBottom: 10,
		marginTop: 5
	},
	signature: {
		flex: 1,
		borderColor: 'rgba(255, 255, 255, 0.5)',
		borderBottomColor: 'rgba(255, 255, 255, 0.5)',
		borderWidth: 1,
	},
	signaturePad: {
		flex: 1,
		height: 100
	},
	signatureImage: {
		backgroundColor: Colors.white,
		maxHeight: 200,
		flex: 1
	},
	buttonStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		backgroundColor: '#eeeeee',
		margin: 10
	},
	reset: {
		...Fonts.style.description,
		color: Colors.red,
		marginTop: 8,
		marginRight: 3
	},
	save: {
		...Fonts.style.description,
		color: Colors.green,
		marginTop: 8,
		marginLeft: 3
	}
})

