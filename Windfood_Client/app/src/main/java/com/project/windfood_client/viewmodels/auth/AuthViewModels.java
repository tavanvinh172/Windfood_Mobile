package com.project.windfood_client.viewmodels.auth;

import android.content.Context;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.project.windfood_client.models.User;
import com.project.windfood_client.repositories.auth.AuthRepositories;
import com.project.windfood_client.responses.UserResponses;

public class AuthViewModels extends ViewModel {
    private AuthRepositories authRepositories;

    public AuthViewModels(){
        authRepositories = new AuthRepositories();
    }

    public LiveData<String> loginUser(User user){
        return authRepositories.loginUser(user);
    }
}
