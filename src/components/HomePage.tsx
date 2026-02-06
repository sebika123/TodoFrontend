"use client";
import {
  Button,
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import MenuIcon from "@mui/icons-material/Menu";
import KanbanBoard from "./KanBanBoard";

const LIST_ALL_TASKS = gql`
  query {
    listAllTask {
      id
      title
      description
      status
      createdAt
    }
  }
`;

const CREATE_TASKS = gql`
  mutation CreateTask($input: CreateTaskDto!) {
    createTask(input: $input) {
      id
      title
      description
      status
      createdAt
    }
  }
`;

const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: String!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      id
      title
      status
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: String!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery(LIST_ALL_TASKS);
  const [createTasks] = useMutation(CREATE_TASKS);
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);
  const [deleteTask] = useMutation(DELETE_TASK);

  const createNewTask = async (title: string, description: string) => {
    try {
      await createTasks({
        variables: {
          input: {
            title,
            description,
          },
        },
      });
      refetch();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const updateTask = async (id: string, newStatus: string) => {
    try {
      await updateTaskStatus({
        variables: {
          id,
          status: newStatus,
        },
      });
      refetch();
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const removeTask = async (id: string) => {
    try {
      await deleteTask({
        variables: { id },
      });
      refetch();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  if (error) {
    console.error("Error fetching tasks:", error);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          color: "#333",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            TaskFlow
          </Typography>

          {session ? (
            <Button
              variant="contained"
              onClick={() => {
                signOut();
                router.push("/login");
              }}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "25px",
                textTransform: "none",
                px: 3,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6b3f8f 100%)",
                },
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                router.push("/login");
              }}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "25px",
                textTransform: "none",
                px: 3,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6b3f8f 100%)",
                },
              }}
            >
              Sign In
            </Button>
          )}

          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, ml: 2, color: "#333" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 12,
          flex: 1,
        }}
      >
        <Container maxWidth="xl">
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="error">
                Error loading tasks. Please try again.
              </Typography>
            </Box>
          ) : (
            <KanbanBoard
              tasks={data?.listAllTask || []}
              onTaskCreate={createNewTask}
              onTaskUpdate={updateTask}
              onTaskDelete={removeTask}
            />
          )}
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          background: "#1a1a2e",
          color: "white",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              width: "100%",
              mt: 4,
              pt: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2024 TaskFlow. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
