import React from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    View,
    Text,
} from 'react-native';

import Pdf from 'react-native-pdf';
const { height, width } = Dimensions.get('window')
export default class ReadOffline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 1,
        };
        this.pdf = null;
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params.data)
    }

    render() {
        let source = { uri:this.props.navigation.state.params.data.path  };
        //let source = {uri:'bundle-assets://test.pdf'};
        //let source = require('./test.pdf'); //ios only
        //let source = {uri:"data:application/pdf;base64, ..."}; // this is a dummy

        return (
                <Pdf ref={(pdf) => { this.pdf = pdf; }}
                    source={source}
                    page={1}
                    scale={1}
                    horizontal={false}
                    /* onLoadComplete={(pageCount) => {
                         this.setState({ pageCount: pageCount });
                     }}
                     onPageChanged={(page, pageCount) => {
                         this.setState({ page: page });
                     }}
                     onError={(error) => {
                         console.log(error);
                     }}*/
                    style={styles.pdf} />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    btn: {
        margin: 5,
        padding: 5,
        backgroundColor: "blue",
    },
    btnDisable: {
        margin: 5,
        padding: 5,
        backgroundColor: "gray",
    },
    btnText: {
        color: "#FFF",
    },
    pdf: {
        flex:1
    }
});
