import React from 'react';
import { Share as RNShare } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import { displayName } from '../../../app.json';

export default class Share extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            feed: this.props.feed,
        };
    };

    share = () => {
        const { feed } = this.state;

        const message = feed.post.url + '\n\n Enviado por ' + displayName 
            + '\n Baixe agora: https://play.google.com/store';

        const result = RNShare.share({
            title: feed.post.title,
            message: message
        });
    };

    render = () => {
        return (
            <Icon name="sharealt" size={35} onPress={() => {
                this.share();
            }}/>
        );
    };
}