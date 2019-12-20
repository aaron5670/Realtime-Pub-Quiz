import React, {useState, useEffect} from "react";
import {connect} from 'react-redux';
import {Dimensions, StyleSheet, View} from 'react-native';
import styled from "styled-components/native";
import Carousel from "react-native-snap-carousel/src/carousel/Carousel";
import {Button, Card, CardHeader, Text,} from '@ui-kitten/components';
import {API_URL} from "../../settings";

const RecentPlayedGames = (props) => {
    const [recentGames, setRecentGames] = useState([]);

    async function fetchRecentGames() {
        const url = `${API_URL}/api/v2/games`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors'
        });
        if (response.status === 200) {
            const data = await response.json()
            setRecentGames(data.data)
        }
    }

    async function deleteGame(id) {
        const url = `${API_URL}/api/v2/games/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors'
        });

        if (response.status === 200) {
            fetchRecentGames();
        }
    }

    useEffect(() => {
        fetchRecentGames();
    }, []);

    const Header = (item) => (
        <CardHeader
            title={item._id}
            description={`Total teams: ${item.teams}`}
        />
    );

    const Footer = (item) => (
        <View style={styles.footerContainer}>
            <Button
                style={styles.footerControl}
                size='small'
                onPress={() => {
                    deleteGame(item._id);
                    alert("clicked on: " + item._id)
                }}>
                DELETE GAME
            </Button>
        </View>
    );

    const _renderItem = ({item, index}) => {
        return (
            <ThumbnailBackgroundView>
                <CurrentGameTO>

                    <Card header={() => Header(item)} footer={() => Footer(item)} status='success'
                          style={{backgroundColor: '#151A30'}}>
                        <Text category='s1' style={{minWidth: 200}}>
                            Game status:
                        </Text>
                        <Text style={{minWidth: 200}}>
                            {item.game_status}
                        </Text>
                    </Card>
                </CurrentGameTO>
            </ThumbnailBackgroundView>
        );
    };

    const handleSnapToItem = (index) => {
        console.log("snapped to ", index)
    };

    const carousel = () => {
        if (recentGames && recentGames.length > 0) {
            return (
                <Carousel
                    data={recentGames}
                    renderItem={_renderItem}
                    onSnapToItem={handleSnapToItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    firstItem={0}
                    autoplay={false}
                    loop={false}
                />
            )
        }else {
            return <Text category={'s1'} style={{marginLeft: 8}}>No recent games found</Text>

        }
    };

    return carousel()
};

const {width: viewportWidth} = Dimensions.get('window');

const horizontalMargin = 40;
const slideWidth = (viewportWidth / 2) - 25;

const sliderWidth = viewportWidth;
const itemWidth = slideWidth + horizontalMargin * 2;

const styles = StyleSheet.create({
    slide: {
        width: itemWidth,
        paddingHorizontal: horizontalMargin
        // other styles for the item container
    },
    slideInnerContainer: {
        width: slideWidth,
        flex: 1,
        // other styles for the inner container
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerControl: {
        marginHorizontal: 4,
    },
});

const ThumbnailBackgroundView = styled.View`
  justify-content: center;
  align-items: center;
  width: 256; 
`;

const CurrentGameTO = styled.TouchableOpacity``;

const mapStateToProps = (state) => ({
    recentGames: state.app.recentGames,
});

const mapDispatchToProps = (dispatch) => ({
    // mapDispatchToProps
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentPlayedGames);
