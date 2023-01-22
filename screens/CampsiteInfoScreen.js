import RenderCampsite from '../features/campsites/RenderCampsite';
import { FlatList, StyleSheet, Text, View, Button, Modal, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../features/favorites/favoritesSlice';
import { useState } from 'react';
import { Rating, Input } from 'react-native-elements';
import { postComment } from '../features/comments/commentsSlice';






const CampsiteInfoScreen = ({ route }) => {
    const [showModal, setShowModal] = useState(false);

    const [rating, setRating] = useState(5);
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');


    const { campsite } = route.params;
    const comments = useSelector((state) => state.comments);
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch();

    const handleSubmit = () => {
        const newComment = {
            author,
            rating,
            text,
            campsiteId: campsite.id
        }
        dispatch(postComment(newComment));
        setShowModal(!showModal);
    }

    const resetForm = () => {
        setRating(5);
        setAuthor('');
        setText('');
    }

    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating
                    readonly
                    startingValue={rating}
                    style={{ alignItems: 'flex-start', paddingVertical: '5%' }}
                    imageSize={10} //have to increase image size, 10 is to small for my screen.

                />
                <Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        )
    }

    return (
        <>
            <FlatList
                data={comments.commentsArray.filter(
                    (comment) => comment.campsiteId === campsite.id
                )}
                renderItem={renderCommentItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ marginHorizontal: 20, paddingVertical: 20 }}
                ListHeaderComponent={
                    <>
                        <RenderCampsite
                            onShowModal={() => setShowModal(!showModal)}
                            campsite={campsite}
                            isFavorite={favorites.includes(campsite.id)}
                            markFavorite={() => dispatch(toggleFavorite(campsite.id))}
                        />
                        <Text style={styles.commentsTitle}>Comments</Text>
                    </>
                }
            />
            <>
                <Modal
                    animationType='slide'
                    transparent={false}
                    visible={showModal}
                    onRequestClose={() => setShowModal(!showModal)}
                >
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            startingValue={rating}
                            imageSize={40}
                            onFinishRating={(rating) => setRating(rating)}
                            style={{ paddingVertical: 10 }}
                        />
                        <Input
                            placeholder='Author'
                            leftIcon='user-o'
                            leftIconContainerStyle={{ padding: 10 }}
                            onChangeText={(author) => setAuthor(author)}
                            value
                        />
                        <Input
                            placeholder='Comment'
                            leftIcon='comment-o'
                            leftIconContainerStyle={{ padding: 10 }}
                            onChangeText={(text) => setText(text)}
                            value
                        />
                        <View style={{ margin: 10 }}>
                            <Button
                                title='Submit'
                                color='#5637DD'
                                onPress={() => {
                                    handleSubmit();
                                    resetForm();
                                }}
                            />
                        </View>
                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => {
                                    setShowModal(!showModal);
                                    resetForm();
                                }}
                                style={{ color: '#808080' }}
                                title='Cancel'
                            >
                            </Button>
                        </View>
                    </View>
                </Modal>
            </>
        </>
    )
}

const styles = StyleSheet.create({
    commentsTitle: {
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#43484D',
        padding: 10,
        paddingTop: 30
    },
    commentItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },

    modal: {
        justifyContent: 'center',
        margin: 20
    }
});

export default CampsiteInfoScreen;