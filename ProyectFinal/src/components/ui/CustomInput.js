import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { customInputStyles } from './CustomInput.styles';

export const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error = false,
  errorMessage = '',
  style,
  ...props
}) => {
  return (
    <View style={[customInputStyles.container, style]}>
      <TextInput
        style={[
          customInputStyles.input,
          error && customInputStyles.inputError
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor="#C7C7CC"
        {...props}
      />
      {error && errorMessage ? (
        <Text style={customInputStyles.errorText}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};