<template>
    <!-- Menu Header -->
    <li 
      v-if="item.header" 
      class="menu-header px-6 py-2 text-xs font-semibold uppercase tracking-wider opacity-50 transition-opacity duration-300"
      :class="{ 'opacity-0': isCollapsed }"
    >
      <span>{{ item.header }}</span>
    </li>
  
    <!-- Menu Item -->
    <li 
      v-else
      class="menu-item relative"
      :class="{ 
        'sub-menu': item.submenu, 
        'open': isOpen,
        'active': isActive
      }"
    >
      <a 
        href="#" 
        class="flex items-center h-12 px-5 text-gray-400 hover:text-gray-200"
        @click="toggleSubmenu"
      >
        <!-- Menu Icon -->
        <span class="menu-icon flex items-center justify-center w-9 h-9 mr-2 text-lg rounded">
          <i :class="item.icon"></i>
        </span>
  
        <!-- Menu Title -->
        <span 
          class="menu-title flex-grow text-sm overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-300"
          :class="{ 'text-gray-200': isActive }"
        >
          {{ item.title }}
        </span>
  
        <!-- Menu Prefix/Suffix -->
        <span v-if="item.prefix" class="menu-prefix px-1">
          {{ item.prefix }}
        </span>
  
        <span v-if="item.suffix" class="menu-suffix px-1">
          {{ item.suffix }}
        </span>
  
        <!-- Badge -->
        <span 
          v-if="item.badge" 
          class="badge ml-2 px-2 py-1 text-xs font-bold rounded"
          :class="{
            'bg-purple-600': item.badge.type === 'primary',
            'bg-green-600': item.badge.type === 'secondary'
          }"
        >
          {{ item.badge.text }}
        </span>
  
        <!-- Submenu Indicator -->
        <span 
          v-if="item.submenu" 
          class="submenu-indicator transform transition-transform duration-300"
          :class="{ 'rotate-90': isOpen && !isCollapsed }"
        >
          <i class="ri-arrow-right-s-line"></i>
        </span>
      </a>
  
      <!-- Submenu -->
      <div 
        v-if="item.submenu" 
        class="sub-menu-list overflow-hidden"
        :class="{ 
          'hidden': !isOpen && !isCollapsed,
          'absolute left-full top-0 ml-1 w-48 bg-gray-800 rounded shadow-lg z-50': isCollapsed
        }"
      >
        <ul>
          <sidebar-menu-item 
            v-for="(subItem, index) in item.submenu" 
            :key="index"
            :item="subItem"
            :is-collapsed="isCollapsed"
            @toggle-submenu="handleSubmenuToggle"
          />
        </ul>
      </div>
    </li>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'SidebarMenuItem',
    props: {
      item: {
        type: Object,
        required: true
      },
      isCollapsed: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { emit }) {
      const isOpen = ref(false);
      const isActive = ref(false); // You can set this based on route or other logic
  
      const toggleSubmenu = () => {
        if (props.item.submenu) {
          if (props.isCollapsed) {
            emit('toggle-submenu');
          } else {
            isOpen.value = !isOpen.value;
          }
        }
      };
  
      const handleSubmenuToggle = () => {
        emit('toggle-submenu');
      };
  
      return {
        isOpen,
        isActive,
        toggleSubmenu,
        handleSubmenuToggle
      };
    }
  };
  </script>
  
  <style>
  /* Animation for menu icons */
  .menu-item:hover .menu-icon i {
    animation: swing ease-in-out 0.5s 1 alternate;
  }
  </style>