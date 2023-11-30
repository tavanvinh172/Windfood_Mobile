package com.project.windfood_client;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.project.windfood_client.databinding.ActivityAuthBinding;
import com.project.windfood_client.databinding.ActivityMainBinding;
import com.project.windfood_client.models.User;
import com.project.windfood_client.network.ApiClient;
import com.project.windfood_client.responses.UserResponses;
import com.project.windfood_client.ui.auth.AuthActivity;
import com.project.windfood_client.utils.CustomToast;
import com.project.windfood_client.utils.SharedPrefManager;
import com.project.windfood_client.viewmodels.auth.AuthViewModels;

public class MainActivity extends AppCompatActivity {

    private ActivityAuthBinding binding;
    private ActivityMainBinding mainBinding;
    private AuthViewModels authViewModels;
    private EditText editTextUsername, editTextPassword;
    private Button buttonLogin;
    private SharedPrefManager sharedPrefManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        doInitialization();
//        sharedPrefManager.clearToken();
        if(sharedPrefManager.getToken().isEmpty()){
            binding = ActivityAuthBinding.inflate(getLayoutInflater());
            setContentView(binding.getRoot());
            editTextUsername = findViewById(R.id.editTextUsername);
            editTextPassword = findViewById(R.id.editTextPassword);
            buttonLogin = findViewById(R.id.buttonLogin);
            buttonLogin.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    User user = new User(editTextUsername.getText().toString(), editTextPassword.getText().toString());
                    if(user.getUsername().isEmpty() || user.getPassword().isEmpty()){
                        CustomToast.makeText(MainActivity.this, "Tên đăng nhập hoặc mật khẩu không được bỏ trổng!", CustomToast.LENGTH_LONG, CustomToast.CONFUSING, true).show();
                    }else{
                        authViewModels.loginUser(user).observe(MainActivity.this, response -> {
                            if(!response.isEmpty()){
                                sharedPrefManager.saveToken(response.toString());
                                CustomToast.makeText(MainActivity.this, "Đăng nhập thành công!", CustomToast.LENGTH_LONG, CustomToast.SUCCESS, true).show();
                            }else{
                                CustomToast.makeText(MainActivity.this, "Đăng nhập thất bại!", CustomToast.LENGTH_LONG, CustomToast.ERROR, true).show();
                            }
                        });
                    }
                }
            });
        }else{
            mainBinding = ActivityMainBinding.inflate(getLayoutInflater());
            setContentView(mainBinding.getRoot());

            BottomNavigationView navView = findViewById(R.id.nav_view);
            AppBarConfiguration appBarConfiguration = new AppBarConfiguration.Builder(
                    R.id.navigation_home, R.id.navigation_dashboard, R.id.navigation_notifications)
                    .build();
            NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_activity_main);
            NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration);
            NavigationUI.setupWithNavController(mainBinding.navView, navController);
        }
    }
    private void doInitialization(){
        authViewModels = new ViewModelProvider(this).get(AuthViewModels.class);
        sharedPrefManager = new SharedPrefManager(this);
    }
}