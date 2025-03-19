<template>
     <div class="sidebar">
            <div class="sidebar-header">
                <h2>Панель управления</h2>
            </div>
            <nav class="sidebar-nav">
                <button @click="$router.push('/InctitutionsMain')" 
                        :class="{ active: $route.path === '/InctitutionsMain' }" 
                        class="sidebar-button">
                    Main menu
                </button>
                <button @click="$router.push('/InstitutionData')" 
                        :class="{ active: $route.path === '/InstitutionData' }" 
                        class="sidebar-button">
                    Данные универа
                </button>
                <button @click="$router.push('/InstitutionEvents')" 
                        :class="{ active: $route.path === '/InstitutionEvents' }" 
                        class="sidebar-button">
                    Ивенты
                </button>
                <button @click="$router.push('/InstitutionApplications')" 
                        :class="{ active: $route.path === '/InstitutionApplications' }" 
                        class="sidebar-button">
                    Управление заявками
                </button>
                <button @click="$router.push('/InstitutionSpecialties')" 
                        :class="{ active: $route.path === '/InstitutionSpecialties' }" 
                        class="sidebar-button">
                    Специальности
                </button>
            </nav>
        </div>
    <div>
        <h1>Управление заявками</h1>
        <p>Управление заявками студентов.</p>
    </div>
</template>