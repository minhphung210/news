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
        let source = { uri: '/Users/minh/Library/Developer/CoreSimulator/Devices/079FD2DE-1D16-4050-8C15-0D2A326E702F/data/Containers/Data/Application/05F47666-CCA2-4780-BD9E-4FE713722C54/Documents/test.pdf' };
        //let source = {uri:'bundle-assets://test.pdf'}; 
        //let source = require('./test.pdf'); //ios only 
        //let source = {uri:"data:application/pdf;base64, ..."}; // this is a dummy 

        return (
                <Pdf ref={(pdf) => { this.pdf = pdf; }}
                    source={source}
                    page={1}
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