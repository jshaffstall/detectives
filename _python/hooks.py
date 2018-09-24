data = {}

def process_info(info, site):
    # Use this to build up a dictionary of mappings of mysteries to
    # categories, series, etc
    #
    # Then create filters that can be used to ask for all the mysteries
    # belonging to a particular category, series, etc
    #
    # {% 'time travel' | categories %}
    # {% 'magic tree house' | series %}
    
    # Start with letting mysteries put category tags in, and collecting those
    # identify mysteries by layout?  
    
    global data
    
    if 'layout' in info and info['layout'] == 'mystery':
        if 'categories' in info:
            for category in info['categories']:
                if category not in data:
                    data[category] = []
                    
                data[category].append(info)
                    
        
