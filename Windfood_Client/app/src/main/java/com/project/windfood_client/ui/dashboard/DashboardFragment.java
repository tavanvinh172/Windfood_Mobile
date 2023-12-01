package com.project.windfood_client.ui.dashboard;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.SeekBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.ValueFormatter;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.interfaces.datasets.IBarDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.github.mikephil.charting.utils.ColorTemplate;
import com.project.windfood_client.R;
import com.project.windfood_client.databinding.FragmentDashboardBinding;
import com.project.windfood_client.viewmodels.dashboard.DashboardViewModel;

import java.util.ArrayList;

public class DashboardFragment extends Fragment{
    private FragmentDashboardBinding binding;
    private BarChart barChart;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        DashboardViewModel dashboardViewModel =
                new ViewModelProvider(this).get(DashboardViewModel.class);

        binding = FragmentDashboardBinding.inflate(inflater, container, false);
        View root = binding.getRoot();
        barChart = root.findViewById(R.id.barChart);
        setLineChartData();
        return root;
    }

    private void setLineChartData() {
        ArrayList<BarEntry> values = new ArrayList<>();
        values.add(new BarEntry(1, 1000));
        values.add(new BarEntry(2, 2000));
        values.add(new BarEntry(3, 3000));
        values.add(new BarEntry(4, 4000));
        values.add(new BarEntry(5, 5000));
        values.add(new BarEntry(6, 6000));
        values.add(new BarEntry(7, 7000));
        values.add(new BarEntry(8, 8000));
        values.add(new BarEntry(9, 9000));
        values.add(new BarEntry(10, 10000));
        values.add(new BarEntry(11, 11000));
        values.add(new BarEntry(12, 12000));

        BarDataSet set1;
        set1 = new BarDataSet(values, "Doanh thu theo tháng");
        set1.setDrawIcons(false);

        ArrayList<IBarDataSet> dataSets = new ArrayList<>();
        dataSets.add(set1);

        BarData data = new BarData(dataSets);

        barChart.setData(data);
        XAxis xAxis = barChart.getXAxis();
        xAxis.setValueFormatter(new ValueFormatter() {
            @Override
            public String getFormattedValue(float value) {
                return "Tháng " + (int) value;
            }
        });
        barChart.invalidate();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}