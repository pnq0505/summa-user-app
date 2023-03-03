import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import SummaInstaller from '../../assets/icons/summa-installer.png';
import SummaButton from '../../components/SummaButton';
import SummaScreen from '../../components/SummaScreen';
import SummaText from '../../components/SummaText';
import { COLORS, FONTS, SIZES } from '../../theme';
import { dWidth } from '../../utils/Dimentions';

export const styles = StyleSheet.create({
  imageContainer: { textAlign: 'center', width: '100%', alignItems: 'center' },
  contentContainer: {
    padding: 30,
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: SIZES.doubleExtra,
    color: '#fff',
    fontWeight: FONTS.extraBold,
  },
  content: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: SIZES.medium,
    color: '#fff',
    fontWeight: FONTS.regular,
  },
  QrBtn: {
    backgroundColor: COLORS.primary,
    marginHorizontal: dWidth > 500 ? '10%' : '1%',
  },
  SigninBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#eee',
  },
});

const Login = ({ navigation }) => {
  return (
    <SummaScreen customContainer={{ justifyContent: 'space-between' }}>
      <View style={styles.imageContainer}>
        <Image source={SummaInstaller}></Image>
      </View>
      <View style={styles.contentContainer}>
        <SummaText doubleExtra>Next level light control</SummaText>
        <SummaText medium>Summa takes controlling your light to the next level.</SummaText>
      </View>
      <View>
        <SummaButton
          customStyle={styles.QrBtn}
          onPressHanlder={() => navigation.navigate('ProjectScanner')}>
          Scan QR
        </SummaButton>
        {/* <SummaButton customStyle={styles.SigninBtn} onPressHanlder={() => console.log('hello')}>
          Login
        </SummaButton> */}
      </View>
    </SummaScreen>
  );
};

export default Login;
