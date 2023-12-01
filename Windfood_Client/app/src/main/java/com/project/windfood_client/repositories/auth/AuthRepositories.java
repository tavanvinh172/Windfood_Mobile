package com.project.windfood_client.repositories.auth;

import android.content.Context;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.project.windfood_client.MainActivity;
import com.project.windfood_client.models.User;
import com.project.windfood_client.network.ApiClient;
import com.project.windfood_client.network.auth.AuthApiService;
import com.project.windfood_client.responses.UserResponses;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AuthRepositories {
    private AuthApiService authApiService;

    public AuthRepositories() {
        authApiService = ApiClient.getRetrofit().create(AuthApiService.class);
    }

    public LiveData<String> loginUser(User user){
        MutableLiveData<String> data = new MutableLiveData<>();
        authApiService.loginUser(user).enqueue(new Callback<String>() {
            @Override
            public void onResponse(@NonNull Call<String> call, @NonNull Response<String> response) {
                System.out.println(response.body());
                data.setValue(response.body());
            }

            @Override
            public void onFailure(@NonNull Call<String> call,@NonNull Throwable t) {
                System.out.println("Throwable: " + t.getLocalizedMessage());
                data.setValue(null);
            }
        });
        return data;
    }

}
