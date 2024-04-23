const foldSidebarButton = document.getElementById('foldSidebar')
const sidebar = document.querySelector('.sidebar')
const profileButton = document.getElementById('toProfile')
const modal = document.getElementById('dialog')

foldSidebarButton.addEventListener('click', () => {
    foldSidebarButton.classList.toggle('fold')
    sidebar.classList.toggle('fold')
})

profileButton.addEventListener('click', (e) => {
    e.preventDefault()
    modal.showModal()
})
