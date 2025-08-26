import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { containerStyles } from './Container.styles';

export const Container = ({ 
  children, 
  style, 
  padding = true, 
  safeArea = true 
}) => {
  const ContainerComponent = safeArea ? SafeAreaView : View;
  
  return (
    <ContainerComponent style={[
      containerStyles.container,
      padding && containerStyles.containerWithPadding,
      style
    ]}>
      {children}
    </ContainerComponent>
  );
};