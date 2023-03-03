import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../theme';
import { dWidth } from '../../utils/Dimentions';

const style = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: COLORS.light,
    marginHorizontal: dWidth > 400 ? '25%' : '1%',
  },
  inputContainer: {
    height: 35,
    backgroundColor: COLORS.fontBackground,
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: '48%',
    marginHorizontal: dWidth > 400 ? '25%' : '1%',
  },
  errorText: {
    marginTop: 7,
    color: COLORS.danger,
    fontSize: 12,
    marginHorizontal: dWidth > 400 ? '25%' : '1%',
  },
});

const SummaInput = ({
  label,
  // iconName,
  customContainer,
  customLabel,
  customInput,
  value,
  error,
  password,
  onFocus = () => {},
  ...props
}) => {
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={customContainer}>
      <Text style={[style.label, customLabel]}>{label}</Text>
      <View
        style={[
          style.inputContainer,
          {
            borderColor: error ? COLORS.warning : isFocused ? COLORS.darkBlue : COLORS.light,
            alignItems: 'center',
          },
        ]}>
        <TextInput
          value={value}
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={[{ color: COLORS.light, flex: 1 }, customInput]}
          {...props}
        />
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
            style={{ color: COLORS.darkBlue, fontSize: 22 }}
          />
        )}
      </View>
      {error && <Text style={style.errorText}>{error}</Text>}
    </View>
  );
};

export default SummaInput;
