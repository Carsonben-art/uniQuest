import React, {useState,useRef} from 'react'
import {View, Text, StyleSheet, FlatList, Animated} from 'react-native';
import OnboardingItem from './OnboardingItem';

import Paginator from './Paginator';
import NextButton from './NextButton';

import slides from '../slides';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from './HomeScreen';



export default Onboarding = () =>{

const [currentIndex, setCurrentIndex] = useState(0);
const scrollX = useRef(new Animated.Value(0)).current;

const slideRef = useRef(null);

const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
}).current;

const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

const navigation = useNavigation();
const scrollTo = async() =>{

    if(currentIndex < slides.length - 1){
    slideRef.current.scrollToIndex({ index: currentIndex + 1})
    }else{
        try {
            await AsyncStorage.setItem('@viewedOnboarding', 'true')
            navigation.navigate("HomeScreen")
               
        } catch (error) {
            console.log('Error @setItem: ', err)
        }
    }
}

    return(
        <View style={styles.container}>
            <View style = {{flex: 3}}>

                <FlatList 
                    data={slides} 
                    renderItem={({item}) => <OnboardingItem item={item}/>}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{nativeEvent: {contentOffset: { x: scrollX}}}],{
                        useNativeDriver: false,
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slideRef}
                    />
            </View>
            <Paginator data={slides} scrollX={scrollX}/>
            <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slides.length)}/>
        </View>
    );
};
const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    }
})