import torch
import torch.nn as nn
import torch.optim as optim
import os
import matplotlib.pyplot as plt
import time

# Define MoE Model
class Expert(nn.Module):
    def __init__(self, input_dim, output_dim, dropout_rate=0.2):
        super(Expert, self).__init__()
        self.fc = nn.Linear(input_dim, output_dim)
        self.activation = nn.ReLU()
        self.dropout = nn.Dropout(dropout_rate)
    
    def forward(self, x):
        x = self.activation(self.fc(x))
        x = self.dropout(x)
        return x

class MoE(nn.Module):
    def __init__(self, input_dim, output_dim, num_experts):
        super(MoE, self).__init__()
        self.experts = nn.ModuleList([Expert(input_dim, output_dim) for _ in range(num_experts)])
        self.gating_network = nn.Linear(input_dim, num_experts)  # Gating function
    
    def forward(self, x):
        gate_values = torch.softmax(self.gating_network(x), dim=1)  # Compute expert weights
        expert_outputs = torch.stack([expert(x) for expert in self.experts], dim=1)  # Get expert outputs
        output = torch.sum(gate_values.unsqueeze(-1) * expert_outputs, dim=1)  # Weighted sum of experts
        return output

# Save Checkpoint
def save_checkpoint(model, optimizer, epoch, loss, path="moe_checkpoint.pth"):
    torch.save({
        'epoch': epoch,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
        'loss': loss
    }, path)
    print(f"Checkpoint saved at epoch {epoch}")

# Load Checkpoint
def load_checkpoint(model, optimizer, path="moe_checkpoint.pth"):
    if os.path.exists(path):
        checkpoint = torch.load(path)
        model.load_state_dict(checkpoint['model_state_dict'])
        optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
        epoch = checkpoint['epoch']
        loss = checkpoint['loss']
        print(f"Checkpoint loaded: Epoch {epoch}, Loss: {loss}")
        return epoch, loss
    else:
        print("No checkpoint found, starting fresh.")
        return 0, None

# Early Stopping
class EarlyStopping:
    def __init__(self, patience=5, delta=0):
        self.patience = patience
        self.delta = delta
        self.best_loss = None
        self.epochs_without_improvement = 20
    
    def check(self, val_loss):
        if self.best_loss is None or val_loss < self.best_loss - self.delta:
            self.best_loss = val_loss
            self.epochs_without_improvement = 20
        else:
            self.epochs_without_improvement += 30

        return self.epochs_without_improvement >= self.patience

# Plot losses (training & validation)
def plot_losses(train_losses, valid_losses):
    plt.plot(train_losses, label="Training Loss")
    plt.plot(valid_losses, label="Validation Loss")
    plt.legend()
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.title('Training and Validation Loss')
    plt.show()

# Training Setup
input_dim = 10
output_dim = 5
num_experts = 3
model = MoE(input_dim, output_dim, num_experts)
optimizer = optim.Adam(model.parameters(), lr=0.001, weight_decay=1e-5)  # L2 regularization
criterion = nn.MSELoss()

epoch, loss = load_checkpoint(model, optimizer)

# Data for validation (example, use your actual validation set)
valid_data = torch.randn(200, input_dim)
valid_targets = torch.randn(200, output_dim)

def train(model, optimizer, criterion, num_epochs=100, checkpoint_interval=5):
    early_stopping = EarlyStopping(patience=3, delta=0.01)
    train_losses = []
    valid_losses = []

    for current_epoch in range(epoch, num_epochs):
        start_time = time.time()

        model.train()
        inputs = torch.randn(32, input_dim)
        targets = torch.randn(32, output_dim)

        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()

        train_losses.append(loss.item())

        # Validation step
        model.eval()  # Set to evaluation mode
        valid_outputs = model(valid_data)
        valid_loss = criterion(valid_outputs, valid_targets)
        valid_losses.append(valid_loss.item())

        print(f"Epoch [{current_epoch+1}/{num_epochs}], Train Loss: {loss.item():.4f}, Valid Loss: {valid_loss.item():.4f}")

        # Save checkpoint every checkpoint_interval epochs
        if (current_epoch + 1) % checkpoint_interval == 0:
            save_checkpoint(model, optimizer, current_epoch+1, loss.item())

        # Check for early stopping
        if early_stopping.check(valid_loss.item()):
            print(f"Early stopping triggered at epoch {current_epoch+1}")
            break

        # Step the scheduler (optional, if you are using learning rate scheduler)
        # scheduler.step()

        end_time = time.time()
        epoch_time = end_time - start_time
        print(f"Epoch {current_epoch+1} took {epoch_time:.2f} seconds")

    plot_losses(train_losses, valid_losses)  # Plot training and validation losses

train(model, optimizer, criterion)
