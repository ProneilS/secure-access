import pandas as pd
import numpy as np
import random

np.random.seed(42)

normal_count = 500
anomaly_count = 20

# Normal behaviour — office hours, consistent IPs, known browsers
normal_data = {
    "hour_of_day": np.random.choice(range(8, 22), normal_count),
    "ip_changed": np.random.choice([0, 0, 0, 0, 1], normal_count),  # rarely changes
    "new_device": np.random.choice([0, 0, 0, 0, 1], normal_count),  # rarely new
    "login_frequency_today": np.random.randint(1, 4, normal_count),  # 1-3 logins/day normal
    "is_anomaly": [0] * normal_count
}

# Anomalous behaviour — odd hours, new IPs, new devices, high frequency
anomaly_data = {
    "hour_of_day": np.random.choice([0, 1, 2, 3, 4, 5, 23], anomaly_count),
    "ip_changed": [1] * anomaly_count,
    "new_device": [1] * anomaly_count,
    "login_frequency_today": np.random.randint(8, 20, anomaly_count),
    "is_anomaly": [1] * anomaly_count
}

df_normal = pd.DataFrame(normal_data)
df_anomaly = pd.DataFrame(anomaly_data)
df = pd.concat([df_normal, df_anomaly], ignore_index=True).sample(frac=1, random_state=42)

df.to_csv("training_data.csv", index=False)
print(f"Generated {len(df)} records ({normal_count} normal, {anomaly_count} anomalous)")
print(df.head())