import React, { Component, useContext, useState } from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel'; // Version can be specified in package.json
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

import ProjectCard from '../project/ProjectCard';
import { FETCH_PROJECTS_QUERY, FETCH_PROJECT_QUERY, DELETE_PROJECT } from '../../util/graphql';
import { SimeContext } from '../../context/SimePovider';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.45);

export default class ProjectCorousel extends Component {

    state = {
        index: 0
    }

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this)
    }

    _renderItem({ item }) {

        return (
            <ProjectCard
                projectId={item.id}
                name={item.name}
                start_date={item.start_date}
                end_date={item.end_date}
                picture={item.picture}
                onSelect={() => { this.props.selectItemHandler(item.id, item.name) }}
                loading={this.props.loading}
            >
            </ProjectCard>
        );
    }


    render() {

        return (
            <View>
                <Carousel
                    ref={(c) => this.carousel = c}
                    data={this.props.projects.slice(0, 3)}
                    renderItem={this._renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    containerCustomStyle={styles.carouselContainer}
                    inactiveSlideShift={0}
                    onSnapToItem={(index) => this.setState({ index })}
                    useScrollView={false}
                    activeSlideAlignment="start"
                />
                <Pagination
                    dotsLength={this.props.projects.slice(0, 3).length}
                    carouselRef={(c) => this.carousel = c}
                    activeDotIndex={this.state.index}
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 5,
                        backgroundColor: 'black'
                    }}
                    inactiveDotStyle={{
                        // Define styles for inactive dots here
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: 5,
        marginHorizontal: 10
    },
});
