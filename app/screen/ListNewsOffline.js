import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    AsyncStorage,
    TouchableOpacity,
    ListView,
    Image
} from 'react-native'
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
const { height, width } = Dimensions.get('window')
export default class ListNewOffline extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataSource: ds,
            data: []
        }
    }
    componentDidMount() {
        let data = this.state.data
        AsyncStorage.getItem('listOffline', (err, result) => {
            let data = JSON.parse(result)
            this.setState({
                dataSource: ds.cloneWithRows(data),
                data: data
            })
            console.log(this.state.dataSource)
        })
    }
    delete(rowID) {
        let data = this.state.data
        data.splice(rowID, 1)
        this.setState({
            dataSource: ds.cloneWithRows(data),
            data: data
        })
        AsyncStorage.setItem('listOffline' , JSON.stringify(data))
    }
    renderData = () => {
        return (
            <ListView
                style={styles.container}
                dataSource={this.state.dataSource}
                renderRow={(rowData, rowID) =>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('ReadOffline_Screen',{data:rowData})}>
                        <View style={styles.item}>
                            <View style={{ height: 30, width: width, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.time}>{rowData.time}</Text>
                                <TouchableOpacity onPress={() => this.delete(rowID)}>
                                    <Image source={require('../../img/round-remove-button.png')}
                                        style={{ height: 20, width: 20 }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text>{rowData.title}</Text>
                        </View>
                    </TouchableOpacity>
                }
            />
        )
    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderData()}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        height: 80,
        width: width,
        borderBottomWidth: 1
    },
    time: {
        margin: 5
    }
})
