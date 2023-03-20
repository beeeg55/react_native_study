import react from "react";
import { View, Text } from "react-native";
import {
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { tvApi } from "../api";
import HList from "../components/HList";
import Loader from "../components/Loader";
import VMedia from "../components/VMedia";

const Tv = () => {
  const queryClient = useQueryClient();
  const {
    isLoading: todayLoading,
    data: todayData,
    isRefetching: todayRefetching,
  } = useQuery(["tv", "today"], tvApi.airingToday);
  const {
    isLoading: topLoading,
    data: topData,
    isRefetching: topRefetching,
  } = useQuery(["tv", "top"], tvApi.topRated);
  const {
    isLoading: trendingLoading,
    data: trendingData,
    isRefetching: trendingRefetching,
  } = useQuery(["tv", "trending"], tvApi.trending);
  const onRefresh = async () => {
    queryClient.refetchQueries(["tv"]);
  };
  const refreshing = todayRefetching || topRefetching || trendingRefetching;
  const loading = todayLoading || topLoading || trendingLoading;
  if (loading) {
    return <Loader />;
  }
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingVertical: 30 }}
    >
      <HList title="Trending TV" data={trendingData.results} />
      <HList title="Airing Today" data={todayData.results} />
      <HList title="TopRated TV" data={topData.results} />
    </ScrollView>
  );
};

export default Tv;
