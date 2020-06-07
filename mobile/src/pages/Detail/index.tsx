import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Linking } from 'react-native'
import Constants from 'expo-constants'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler'
import { DetailParams } from '../../interfaces/DetailParams'
import Api from '../../services/api'
import { Point } from '../../interfaces/Point'
import * as MailComposer from 'expo-mail-composer';


const Detail = () => {
    const [pointInfo, setPointInfo] = useState<Point>({} as Point)
    const navigation = useNavigation()
    const route = useRoute()

    const routeParams = route.params as DetailParams

    useEffect(() => {
        Api.get<Point>(`points/${routeParams.point_id}`).then(response => {
            setPointInfo(response.data)
        })
    }, [])

    function handleNavigateBack() {
        navigation.goBack()
    }

    function handleComposeMail(){
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de resíduos',
            recipients: [pointInfo.email],
        })
    }

    function handleWhatsapp(){
        Linking.openURL(`whatsapp://send?phone=+55${pointInfo.whatsapp}&text=Tenho interesse sobre coleta de resíduos`)
    }

    if (!pointInfo || !pointInfo.point_items)
        return null

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={(handleNavigateBack)}>
                    <Icon name='arrow-left' size={20} color='#34cb79' />
                </TouchableOpacity>

                <Image
                    style={styles.pointImage}
                    source={{ uri: pointInfo.image }} />
                <Text style={styles.pointName}> {pointInfo.name} </Text>

                <Text style={styles.pointItems}>
                    {pointInfo.point_items.map(i => i.title).join(', ')}
                </Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{pointInfo.city}, {pointInfo.uf}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name='whatsapp' size={20} color='#fff' />
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name='mail' size={20} color='#fff' />
                    <Text style={styles.buttonText}>Email</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    pointImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 32,
    },

    pointName: {
        color: '#322153',
        fontSize: 28,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    pointItems: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    address: {
        marginTop: 32,
    },

    addressTitle: {
        color: '#322153',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    addressContent: {
        fontFamily: 'Roboto_400Regular',
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#999',
        paddingVertical: 20,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    button: {
        width: '48%',
        backgroundColor: '#34CB79',
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        marginLeft: 8,
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Roboto_500Medium',
    },
});

export default Detail