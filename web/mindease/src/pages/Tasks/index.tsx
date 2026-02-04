import { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  EyeIcon,
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CalendarIcon,
  ClockIcon
} from '../../components/Icon';
import type { TaskColumn } from './interfaces';
import { tasksMock } from './mock';


const TasksPage = () => {
  const [columns, setColumns] = useState<TaskColumn[]>(tasksMock);

  const toggleColumn = (columnId: string) => {
    setColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, expanded: !col.expanded } : col
      )
    );
  };

  return (
    <Box className="w-full p-8 bg-custom-sand min-h-screen">
      {/* Header */}
      <Box className="flex items-center justify-between mb-8">
        <Typography 
          variant="h4" 
          sx={{ color: '#4A6572', fontWeight: 700 }}
        >
          Tarefas
        </Typography>
        <IconButton size="small" sx={{ color: '#4A6572' }}>
          <EyeIcon size={20} />
        </IconButton>
      </Box>

      {/* Kanban Columns */}
      <Box className="flex gap-6 overflow-x-auto">
        {columns.map((column) => (
          <Box key={column.id} className="flex-1 min-w-[300px]">
            {/* Column Header */}
            <Box 
              className="flex items-center justify-between p-4 rounded-t-lg"
              sx={{ backgroundColor: column.headerColor }}
            >
              <Typography 
                sx={{ 
                  color: '#FFFFFF', 
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
              >
                {column.title}
              </Typography>
              <Box className="flex items-center gap-2">
                <IconButton 
                  size="small" 
                  sx={{ color: '#FFFFFF' }}
                  onClick={() => toggleColumn(column.id)}
                >
                  <PencilIcon size={16} />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ color: '#FFFFFF' }}
                  onClick={() => toggleColumn(column.id)}
                >
                  {column.expanded ? (
                    <ChevronUpIcon size={20} />
                  ) : (
                    <ChevronDownIcon size={20} />
                  )}
                </IconButton>
              </Box>
            </Box>

            {/* Tasks */}
            {column.expanded && (
              <Box className="bg-custom-cream rounded-b-lg p-4 space-y-4">
                {column.tasks.map((task) => (
                  <Box
                    key={task.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    {/* Task Header */}
                    <Box className="flex items-start justify-between mb-2">
                      <Typography 
                        sx={{ 
                          color: '#4A6572', 
                          fontWeight: 600,
                          fontSize: '1rem'
                        }}
                      >
                        {task.title}
                      </Typography>
                      <IconButton size="small" sx={{ color: '#4A6572' }}>
                        <EyeIcon size={16} />
                      </IconButton>
                    </Box>

                    {/* Description */}
                    <Typography 
                      sx={{ 
                        color: '#4A6572', 
                        fontSize: '0.875rem',
                        mb: 2
                      }}
                    >
                      {task.description}
                    </Typography>

                    {/* Dates and Duration */}
                    <Box className="flex items-center gap-4 mb-3">
                      <Box className="flex items-center gap-1">
                        <CalendarIcon size={14} className="text-custom-slate" />
                        <Typography 
                          sx={{ 
                            color: '#4A6572', 
                            fontSize: '0.75rem'
                          }}
                        >
                          {task.startDate}
                        </Typography>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <ClockIcon size={14} className="text-custom-slate" />
                        <Typography 
                          sx={{ 
                            color: '#4A6572', 
                            fontSize: '0.75rem'
                          }}
                        >
                          {task.duration}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Project and Author */}
                    <Box className="flex items-center gap-3">
                      <Box className="flex items-center gap-1">
                        <Typography 
                          sx={{ 
                            color: '#4A6572', 
                            fontSize: '0.75rem'
                          }}
                        >
                          Projeto:
                        </Typography>
                        <Box 
                          className="px-2 py-0.5 rounded"
                          sx={{ backgroundColor: '#FFE5E5' }}
                        >
                          <Typography 
                            sx={{ 
                              color: '#4A6572', 
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            {task.project}
                          </Typography>
                        </Box>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <Typography 
                          sx={{ 
                            color: '#4A6572', 
                            fontSize: '0.75rem'
                          }}
                        >
                          Autor:
                        </Typography>
                        <Box 
                          className="px-2 py-0.5 rounded"
                          sx={{ backgroundColor: '#E0EADD' }}
                        >
                          <Typography 
                            sx={{ 
                              color: '#4A6572', 
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            {task.author}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}

                {/* View All Button */}
                <button
                  className="w-full py-2 px-4 rounded-lg text-white text-sm font-medium transition-colors"
                  style={{ backgroundColor: '#4A6572' }}
                >
                  Todas as tarefas
                </button>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TasksPage;
