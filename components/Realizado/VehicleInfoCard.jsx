import React from 'react';
import { ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const ClientFilesCard = () => {
  return (
    <Card style={{ margin: 10 }}>
      <Card.Content>
        <Title>Archivos Cliente</Title>
        <Paragraph>Aquí puedes incluir detalles o enlaces a los archivos del cliente.</Paragraph>
      </Card.Content>
    </Card>
  );
};

const VehicleFilesCard = () => {
  return (
    <Card style={{ margin: 10 }}>
      <Card.Content>
        <Title>Archivos Vehículo</Title>
        <Paragraph>Aquí puedes incluir detalles o enlaces a los archivos del vehículo.</Paragraph>
      </Card.Content>
    </Card>
  );
};

const App = () => {
  return (
    <ScrollView>
      <ClientFilesCard />
      <VehicleFilesCard />
    </ScrollView>
  );
};

export default App;
