import { CaretLeft } from 'phosphor-react-native';
import React, { useCallback, useState } from 'react';
import SummaHeader from '../../../components/SummaHeader';
import SummaInput from '../../../components/SummaInput';
import SummaScreen from '../../../components/SummaScreen';
import SummaText from '../../../components/SummaText';
import TimeZoneDropDown from './TimezoneDropDown';

const EditProjectField = ({ route, navigation, setField }) => {
  const { field } = route.params;
  const [value, setValue] = useState(field.value);

  const handleChangeButton = useCallback(async () => {
    await setField({ fieldName: field.key, value });
    navigation.goBack();
  }, [navigation, value, field]);

  const handleBackButton = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SummaScreen>
      <SummaHeader
        iconLeftButton={<CaretLeft size={30} color="#fff" />}
        handleLeftButton={handleBackButton}
        iconRightButton={<SummaText>Change</SummaText>}
        handleRightButton={handleChangeButton}
        headerLabel={field.title}
      />
      {field.options?.dropdown ? (
        <TimeZoneDropDown value={value} setValue={setValue} />
      ) : (
        <SummaInput value={value} autoFocus={true} onChangeText={setValue} />
      )}
    </SummaScreen>
  );
};

export default EditProjectField;
