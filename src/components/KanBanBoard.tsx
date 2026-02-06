"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "progress" | "done";
  createdAt: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskCreate: (title: string, description: string) => Promise<void>;
  onTaskUpdate: (id: string, status: string) => Promise<void>;
  onTaskDelete: (id: string) => Promise<void>;
}

export default function KanbanBoard({
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}: KanbanBoardProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const addTask = async () => {
    if (newTask.title.trim() === "") return;

    try {
      await onTaskCreate(newTask.title, newTask.description);
      setNewTask({ title: "", description: "" });
      setIsAddingTask(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleMoveForward = async (task: Task) => {
    let newStatus: string;

    if (task.status === "todo") {
      newStatus = "progress";
    } else if (task.status === "progress") {
      newStatus = "done";
    } else {
      return; // Already at the end
    }

    try {
      await onTaskUpdate(task.id, newStatus);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleMoveBackward = async (task: Task) => {
    let newStatus: string;

    if (task.status === "done") {
      newStatus = "progress";
    } else if (task.status === "progress") {
      newStatus = "todo";
    } else {
      return; // Already at the beginning
    }

    try {
      await onTaskUpdate(task.id, newStatus);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onTaskDelete(id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const getTasksByStatus = (status: "todo" | "progress" | "done") => {
    return tasks.filter((task) => task.status === status);
  };

  const Column = ({
    title,
    status,
    color,
  }: {
    title: string;
    status: "todo" | "progress" | "done";
    color: string;
  }) => {
    const columnTasks = getTasksByStatus(status);
    console.log("🚀 ~ Column ~ columnTasks:", columnTasks);

    return (
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          p: 2,
          minWidth: 300,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: color,
              mr: 1,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
            {title}
          </Typography>
          <Chip
            label={columnTasks.length}
            size="small"
            sx={{ ml: 1, backgroundColor: "#e0e0e0" }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {columnTasks.map((task) => (
            <Card
              key={task.id}
              sx={{
                boxShadow: 1,
                "&:hover": {
                  boxShadow: 3,
                },
                transition: "box-shadow 0.3s",
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {task.title}
                </Typography>
                {task.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {task.description}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions
                sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  {status !== "todo" && (
                    <Button
                      size="small"
                      startIcon={<ArrowBackIcon />}
                      onClick={() => handleMoveBackward(task)}
                      variant="outlined"
                    >
                      Back
                    </Button>
                  )}
                  {status !== "done" && (
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => handleMoveForward(task)}
                      variant="contained"
                    >
                      {status === "todo" ? "Start" : "Complete"}
                    </Button>
                  )}
                </Box>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}

          {columnTasks.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                color: "#999",
                py: 4,
              }}
            >
              <Typography variant="body2">No tasks</Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h3" component="h2" sx={{ fontWeight: 700 }}>
          Project Board
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddingTask(true)}
          size="large"
        >
          Create Task
        </Button>
      </Box>

      <Dialog
        open={isAddingTask}
        onClose={() => {
          setIsAddingTask(false);
          setNewTask({ title: "", description: "" });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Optional"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setIsAddingTask(false);
              setNewTask({ title: "", description: "" });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={addTask}
            variant="contained"
            disabled={!newTask.title.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: "flex", gap: 3, overflowX: "auto" }}>
        <Column title="TO DO" status="todo" color="#9e9e9e" />
        <Column title="IN PROGRESS" status="progress" color="#2196f3" />
        <Column title="DONE" status="done" color="#4caf50" />
      </Box>
    </Container>
  );
}
