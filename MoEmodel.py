import torch
import torch.nn as nn
import torch.optim as optim
import os

# Define MoE Model
class Expert(nn.Module):
    def __init__(self, input_dim, output_dim):
        super(Expert, self).__init__()
        self.fc = nn.Linear(input_dim, output_dim)
        self.activation = nn.ReLU()
    
    def forward(self, x):
        return self.activation(self.fc(x))

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

# Training Setup
input_dim = 10
output_dim = 5
num_experts = 3
model = MoE(input_dim, output_dim, num_experts)
optimizer = optim.Adam(model.parameters(), lr=0.001)
criterion = nn.MSELoss()

epoch, loss = load_checkpoint(model, optimizer)

def train(model, optimizer, criterion, num_epochs=10, checkpoint_interval=5):
    start_epoch = epoch  # Use a different variable name to avoid shadowing
    for current_epoch in range(start_epoch, num_epochs):  # Rename loop variable
        inputs = torch.randn(32, input_dim)
        targets = torch.randn(32, output_dim)
        
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()
        
        print(f"Epoch [{current_epoch+1}/{num_epochs}], Loss: {loss.item():.4f}")
        
        # Save checkpoint at specified interval
        if (current_epoch + 1) % checkpoint_interval == 0:
            save_checkpoint(model, optimizer, current_epoch+1, loss.item())

train(model, optimizer, criterion)
