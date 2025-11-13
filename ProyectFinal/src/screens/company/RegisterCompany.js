import React, { useState } from "react";
import { 
    View, 
    Text, 
    Image, 
    ScrollView,
    Pressable 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { HeaderScreen, InputLogin, ButtonLogin, Banner } from "../../components";
import { COLORS } from "../../components/constants/theme";
import styles from "../../styles/screens/company/RegisterStyles";

export default function RegisterCompany({ navigation }) {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: '',
        rfc: '',
        address: '',
        ownerName: '',
        logo: null,
        officialId: null,
        proofOfAddress: null,
        fiscalStatus: null
    });
    const [showBanner, setShowBanner] = useState(false);
    const [bannerMessage, setBannerMessage] = useState('');
    const [bannerType, setBannerType] = useState('success');

    const handleImagePick = async (field) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                [field]: result.assets[0].uri
            }));
        }
    };

    const handleDocumentPick = async (field) => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf'],
            copyToCacheDirectory: true
        });

        if (result.type === 'success') {
            setFormData(prev => ({
                ...prev,
                [field]: result.uri
            }));
        }
    };

    const handleRegister = () => {
        setBannerMessage('Registro exitoso');
        setBannerType('success');
        setShowBanner(true);
        setTimeout(() => {
            setShowBanner(false);
            navigation.navigate('LoginCompany');
        }, 2000);
    };

    const renderDocumentButton = (title, field, type = 'document') => (
        <Pressable 
            onPress={() => type === 'image' ? handleImagePick(field) : handleDocumentPick(field)}
            style={({pressed}) => [
                styles.documentButton,
                pressed && {opacity: 0.7}
            ]}
        >
            <Ionicons 
                name={type === 'image' ? "image-outline" : "document-text-outline"} 
                size={24} 
                color={COLORS.primary} 
            />
            <Text style={styles.documentButtonText}>{title}</Text>
            {formData[field] && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            )}
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <HeaderScreen 
                title="Registro de Empresa"
                leftIcon={<Ionicons name="arrow-back" size={24} color="black" />}
                onLeftPress={() => navigation.goBack()}
            />

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.welcomeContainer}>
                        <Pressable onPress={() => handleImagePick('logo')}>
                            {formData.logo ? (
                                <Image source={{ uri: formData.logo }} style={styles.logoImage} />
                            ) : (
                                <View style={styles.logoPlaceholder}>
                                    <Ionicons name="business-outline" size={50} color={COLORS.primary} />
                                    <Text style={styles.logoPlaceholderText}>Logo empresa</Text>
                                </View>
                            )}
                        </Pressable>
                    </View>

                    {/* Formulario */}
                    <View style={styles.formContainer}>
                        <View style={styles.group}>
                            <Text style={styles.label}>Nombre de la Empresa</Text>
                            <InputLogin 
                                msj="Nombre de la empresa" 
                                value={formData.companyName}
                                onChangeText={(text) => setFormData(prev => ({...prev, companyName: text}))}
                            />
                        </View>

                        <View style={styles.group}>
                            <Text style={styles.label}>Correo Electrónico</Text>
                            <InputLogin 
                                msj="empresa@correo.com"
                                keyboardType="email-address"
                                value={formData.email}
                                onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
                            />
                        </View>

                        <View style={styles.group}>
                            <Text style={styles.label}>Teléfono</Text>
                            <InputLogin 
                                msj="(XXX) XXX-XXXX"
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={(text) => setFormData(prev => ({...prev, phone: text}))}
                            />
                        </View>

                        <View style={styles.group}>
                            <Text style={styles.label}>RFC</Text>
                            <InputLogin 
                                msj="XXXX000000XXX"
                                autoCapitalize="characters"
                                value={formData.rfc}
                                onChangeText={(text) => setFormData(prev => ({...prev, rfc: text}))}
                            />
                        </View>

                        <View style={styles.group}>
                            <Text style={styles.label}>Dirección Fiscal</Text>
                            <InputLogin 
                                msj="Dirección completa"
                                multiline
                                numberOfLines={2}
                                value={formData.address}
                                onChangeText={(text) => setFormData(prev => ({...prev, address: text}))}
                            />
                        </View>

                        <View style={styles.group}>
                            <Text style={styles.label}>Nombre del Representante</Text>
                            <InputLogin 
                                msj="Nombre completo"
                                value={formData.ownerName}
                                onChangeText={(text) => setFormData(prev => ({...prev, ownerName: text}))}
                            />
                        </View>

                        {/* Documentos */}
                        <View style={styles.documentsContainer}>
                            <Text style={styles.sectionTitle}>Documentos Requeridos</Text>
                            {renderDocumentButton('Identificación Oficial', 'officialId')}
                            {renderDocumentButton('Comprobante de Domicilio', 'proofOfAddress')}
                        </View>

                        <View style={styles.buttonContainer}>
                            <ButtonLogin
                                title="Registrar Empresa"
                                onPress={handleRegister}
                                icon={<Ionicons name="business" size={24} color="white" />}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            <Banner
                visible={showBanner}
                message={bannerMessage}
                type={bannerType}
                onHide={() => setShowBanner(false)}
            />
        </SafeAreaView>
    );
}
