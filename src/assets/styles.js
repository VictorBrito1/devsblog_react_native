import styled from 'styled-components/native';

export const Avatar = styled.Image`
    padding: 4px;
    width: 45px;
    height: 45px;
    border-radius: 10px;
`;

export const AuthorName = styled.Text`
    padding: 8px;
    font-size: 18px;
    font-weight: bold;
    color: #59594a;
`;

export const PostTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #59594a;
`;

export const PostTitleComment = styled.Text`
    marginLeft: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #59594a;
`;

export const PostBody = styled.Text`
    font-size: 16px;
    color: #59594a;
`;

export const Likes = styled.Text`
    font-size: 16px;
    color: #59594a;
`;

export const SearchInput = styled.TextInput`
    height: 40px;
    width: 100%;
    background-color: #FFF;
    border-color: #c7c7c7;
    border-width: 1;
    border-radius: 8px;
`

export const Centralized = styled.View`
    flexDirection: row;
    justify-content: center;
    align-items: center;
`;

export const ContainerMenu = styled.View`
    flex: 1;
    font-size: 18px;
    background-color: #fff;
`;

export const LeftRow = styled.View`
    flexDirection: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
`;

export const MenuDivider = styled.View`
    marginVertical: 5;
    marginHorizontal: 5;
    border-bottom-width: 1;
    borderColor: #050505;
`;

export const Spacer = styled.View`
    flexDirection: row;
    padding: 10px;
`;

export const CommentDivider = styled.View`
    marginVertical: 5;
    marginHorizontal: 5;
    border-bottom-width: 1;
    borderColor: #3f6ea3;
`;

export const ContainerComment = styled.View`
    flexDirection: column;
    width: 100%;
    height: 100%;
    background-color: #fff;
`;

export const ContainerCurrentUserComment = styled.View`
    background-color: #ffefbd;
`;

export const ContainerOtherUserComment = styled.View`
    background-color: #eff2f1;
`;

export const CommentSpacer = styled.View`
    marginVertical: 10;
`;

export const ContainerNewComment = styled.View`
    margin-top: 100;
    align-self: center;
    width: 95%;
    border-color: #7ca982;
    border-width: 1;
    border-radius: 6;
    background-color: #fffcf9;
`;

export const CommentAuthor = styled.Text`
    padding: 6px;
    font-size: 16px;
    color: #283044;
`;

export const Comment = styled.Text`
    padding: 6px;
    font-size: 16px;
    color: #283044;
`;

export const CommentDate = styled.Text`
    padding: 6px;
    font-size: 16px;
    color: #283044;
`;