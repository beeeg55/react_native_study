import React from "react";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";
import VMedia from "./VMedia";
const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
  margin-bottom: 20px;
`;
const ListContainer = styled.View`
  margin-bottom: 40px;
`;

export const HListSeperator = styled.View`
  width: 20px;
`;

interface HListProps {
  title: string;
  data: any[];
}
const HList: React.FC<HListProps> = ({ title, data }) => (
  <ListContainer>
    <ListTitle>{title}</ListTitle>
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 30 }}
      ItemSeparatorComponent={HListSeperator}
      data={data}
      keyExtractor={(item) => item.id + ""}
      renderItem={({ item }) => (
        <VMedia
          posterPath={item.poster_path}
          originalTitle={item.original_title ?? item.original_name}
          voteAverage={item.vote_average}
          fullData={item}
        />
      )}
    />
  </ListContainer>
);

export default HList;
