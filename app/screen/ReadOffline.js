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
    }

    prePage = () => {
        if (this.pdf) {
            let prePage = this.state.page > 1 ? this.state.page - 1 : 1;
            this.pdf.setNativeProps({ page: prePage });
            this.setState({ page: prePage });
            console.log(`prePage: ${prePage}`);
        }
    }

    nextPage = () => {
        if (this.pdf) {
            let nextPage = this.state.page + 1 > this.state.pageCount ? this.state.pageCount : this.state.page + 1;
            this.pdf.setNativeProps({ page: nextPage });
            this.setState({ page: nextPage });
            console.log(`nextPage: ${nextPage}`);
        }

    }

    render() {
        let source = { uri: '/Users/Macbook/Library/Developer/CoreSimulator/Devices/998FB079-4CB2-42DF-9DCC-96A462CBF0FD/data/Containers/Data/Application/2292D0EE-E1A9-422B-B426-AF9C2D9528DE/Documents/test.pdf' };
        //let source = {uri:'bundle-assets://test.pdf'};
        //let source = require('./test.pdf'); //ios only
        //let source = {uri:"data:application/pdf;base64, ..."}; // this is a dummy

        return (
                <Pdf ref={(pdf) => { this.pdf = pdf; }}
                    source={source}
                    page={1}
                    scale={1.5}
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
        width: width+20,
        height: height,
    }
});
