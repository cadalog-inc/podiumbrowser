require 'sketchup'
require 'rubygems'
require 'prime'
require 'json'
require 'open-uri'
require 'net/http'
require 'base64'

class SU_Podium_Browser_Standalone_LoadHandler_V3
    attr :error

    def initialize(name, source)
        @name = name
        @source = source
        message = "Loading #{@name} from #{@source}..."
        puts(message)
        Sketchup::set_status_text(message)
    end
    def onPercentChange(p)
        puts('percent changed...' + p.to_i.to_s + "%")
        Sketchup::set_status_text("Loading #{@name} : " + p.to_i.to_s + "%")
    end 
    def cancelled?
        return false
    end
    def onSuccess
        puts("done!")
        Sketchup::set_status_text('')
    end
    def onFailure(error_message)
        puts "on failure"
        message = "Error loading #{@name}:\n" + error_message
        puts(message)
        UI.messagebox(message, MB_OK, "SU_Podium_Browser_Standalone load error")
        Sketchup::set_status_text('')
    end
end

class SU_Podium_Browser_Standalone_V3
    @@dialog = UI::HtmlDialog.new({
      :dialog_title => "SU Podium Browser V3",
      :preferences_key => "SUPB",
      :scrollable => true,
      :resizable => true,
      :width => 1100,
      :height => 850,
      :left => 100,
      :top => 100,
      :min_width => 400,
      :min_height => 500,
      :max_width =>1500,
      :max_height => 1500,
      :style => UI::HtmlDialog::STYLE_WINDOW
    })
    @@license = nil
    def initialize()
        LicenseManager.checkin()
        @@license = LicenseManager.getLicense()
        if(!@@dialog.visible? && @@license != nil)
            if(LicenseManager.isTrial() || !LicenseManager.isValid())
                @@dialog.set_url("http://v3.pdm-plants-textures.com/?license=&mac_address=&prompted=true")
            else
                @@dialog.set_url("http://v3.pdm-plants-textures.com/?license=#{@@license.key}&mac_address=#{@@license.fingerprint}&prompted=true")
            end
            @@dialog.set_size(1100, 850)
            @@dialog.add_action_callback("on_load_comp") { |action_context, values|
                on_load_comp(action_context, values)
            }
            @@dialog.show()
        end
    end
    def on_load_comp(dlg, params)
        hash, cat, name = params.split('|')
        name = name.gsub(/[[:space:]]/, '')
        ext = 'skp'
        if (cat == 'hdr')
            ext = 'hdr'
        end
        url = "http://v3.pdm-plants-textures.com/download/#{hash}/#{@@license.key}/#{@@license.fingerprint}/#{name}.#{ext}"
        if(ext == 'hdr')
            place_hdr("#{name}.hdr", url)
        else
            place_skp(name, hash, cat, url)
        end
    end
    def place_skp(name, hash = nil, cat = nil, url = nil)
        Sketchup.active_model.start_operation("Download Component")

        model = Sketchup.active_model
        definitions = model.definitions
        componentdefinition = nil

        # TODO: refactor if possible
        if(Object::RUBY_PLATFORM =~ /mingw/i)
            if (url)
                load_handler = SU_Podium_Browser_Standalone_LoadHandler_V3.new(name, url)
                componentdefinition = definitions.load_from_url(url, load_handler)
              else
                componentdefinition = definitions.load name
              end
            
              return if not componentdefinition
                
              componentdefinition.name = name.gsub(/-/, '_')
            
              if (@cat == "library")
                # Remove lines from plants/trees
                for ent in componentdefinition.entities
                  if( ent.is_a? Sketchup::Edge )
                    ent.hidden=true
                  end
                end
              end
            
              repeat = false
              if (Sketchup.read_default("Cadalog/SU_Podium_Browser_Standalone", "InsertMode", "Single") == "Multiple")
                repeat = true
              end
              model.place_component(componentdefinition, repeat)
            
              Sketchup.active_model.commit_operation
        else
            if(url)
                load_handler = SU_Podium_Browser_Standalone_LoadHandler_V3.new(name, url)

                UI.start_timer(1.0, false) {
                    componentdefinition = definitions.load_from_url(url, load_handler)
                    componentdefinition.name = name.gsub(/-/, '_')

                    if (@cat == "library")
                        # Remove lines from plants/trees
                        for ent in componentdefinition.entities
                            if( ent.is_a? Sketchup::Edge )
                                ent.hidden=true
                            end
                        end
                    end

                    repeat = false
                    if (Sketchup.read_default("Cadalog/SU_Podium_Browser_Standalone", "InsertMode", "Single") == "Multiple")
                        repeat = true
                    end
                    model.place_component(componentdefinition, repeat)

                    Sketchup.active_model.commit_operation
                }
            end
        end
    end
    def place_hdr(name, url)
        dir = Sketchup.find_support_file( 'Plugins/PodiumHDR' )
        dest = File.join(dir, name)
        if (File.file?(dest))
            UI.messagebox("#{name} is already downloaded and available for use.")
            return
        else
            Sketchup::set_status_text("Downloading: #{name}.")
            UI.start_timer(1.0, false) {
                begin
                    open(url) do |u|
                        File.open(dest, 'wb') { |f|
                            f.write(u.read)
                            HDRImageDownloadDialog("HDR Download Complete", "#{name} was successfully downloaded and is now available for use.")
                            Sketchup::set_status_text('')
                        }
                    end
                rescue Exception => e
                    print(e)
                    HDRImageDownloadDialog("HDR Download Error", "#{name} was not successfully downloaded.")
                    Sketchup::set_status_text('')
                end
            }
        end
    end
end

def HDRImageDownloadDialog(title, message)
    dialog = UI::HtmlDialog.new({
        :dialog_title => title,
        :preferences_key => "HDRIMAGEDOWNLOAD",
        :scrollable => false,
        :resizable => false,
        :width => 0,
        :height => 0,
        :left => 100,
        :top => 100,
        :min_width => 0,
        :min_height => 0,
        :max_width =>0,
        :max_height => 0,
        :style => UI::HtmlDialog::STYLE_DIALOG
    })
    html = <<-HTML 
        <html>
        <head>
            <style>
                body {
                    background-color: #f3f3f7;
                    font-family: 'Open Sans', 'Helvetica Neue', Arial, Helvetica, sans-serif, Meiryo;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div align="center">
                #{message}
            </div>
        </body>
        </html>
    HTML
    dialog.set_html(html)
    dialog.set_size(300, 90)
    dialog.center

    dialog.show
end

class SU_Podium_Browser_Standalone_Licensing_V3
    def SU_Podium_Browser_Standalone_Licensing_V3.startUp
        if ( Sketchup.version.to_i < 17 )
            message = "This application requires SketchUp 2017 or later to run.\nYou have a previous version.\nPlease download a newer version first."
            UI.messagebox( message, MB_OK, "SketchUp 2017 Required")
            UI.beep
        else
            if (not Sketchup.is_online)
                UI.messagebox("SU Podium Browser requires an internet connection.")
            else
                SU_Podium_Browser_Standalone_V3.new
            end
        end
    end
end