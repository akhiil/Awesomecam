import React, { Component } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions } from 'react-native';

const phw = Dimensions.get('window').width;
const phh = Dimensions.get('window').height;

class ImageLoader extends Component {
    state = {
        opacity: new Animated.Value(0),
    }

    onLoad = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
        }).start();
    }

    render() {
        return (
            <Animated.Image
                onLoad={this.onLoad}
                {...this.props}
                style={[
                    {
                        opacity: this.state.opacity,
                        transform: [
                            {
                                scale: this.state.opacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.85, 1],
                                })
                            },
                        ],
                    },
                    this.props.style,
                ]}
            />
        );
    }
}

const App = () => (
    <View style={styles.container}>
        <ImageLoader
            style={styles.image}
            source={require('../components/images/camera-image.png')}
        />
        <Text style={styles.textStyle}>welcome to AwesomeCam</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffe6',
        borderColor: 'green',
        borderWidth: 30
    },
    image: {
        flex: 1,
        width: phw,
        borderRadius: 20,
        resizeMode: 'contain'
    },
    textStyle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 160,
        color: 'green'
    }
});

export default App;