package com.project.windfood_client.network.auth;

import com.project.windfood_client.models.User;
import com.project.windfood_client.responses.UserResponses;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface AuthApiService {

    @POST("persons/login")
    Call<String> loginUser(@Body User user);

    @GET("most-popular")
    Call<Object> getMostPopularTVShows(@Query("page") int page);
}
