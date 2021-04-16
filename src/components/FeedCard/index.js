import React from 'react';

import { TouchableOpacity } from 'react-native';
import { Card, CardContent, CardImage } from 'react-native-cards';
import Icon from 'react-native-vector-icons/AntDesign';

import avatar from '../../assets/images/avatar.jpeg';
import postImage from '../../assets/images/post.jpeg';
import {
    Avatar,
    AuthorName,
    PostTitle,
    PostBody,
    Likes,
    LeftRow,
    Spacer
} from '../../assets/styles';

export default class FeedCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            feed: this.props.feed,
            navigator: this.props.navigator
        };
    };

    render = () => {
        const { feed, navigator } = this.state;

        return (
            <TouchableOpacity onPress={() => {
                navigator.navigate('Details', { idFeed: feed.item._id});
            }}>
                <Card>
                    <CardImage source={postImage}/>

                    <CardContent>
                        <PostTitle>{feed.item.post.title}</PostTitle>

                        <Spacer/>

                        <LeftRow>
                            <Avatar source={avatar}/>
                            <AuthorName>{feed.item.author.name}</AuthorName>
                        </LeftRow>
                    </CardContent>

                    <CardContent>
                        <LeftRow>
                            <Icon name="heart" size={25} color={'#ff0000'}>
                                <Likes>  {feed.item.likes}</Likes>
                            </Icon>
                        </LeftRow>
                        
                    </CardContent>
                </Card>
            </TouchableOpacity>
        );
    };
}