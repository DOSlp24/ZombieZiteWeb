package controllers

import de.htwg.se.zombiezite
import de.htwg.se.zombiezite.ZombieZiteApp
import javax.inject._
import play.api.mvc._


/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class HomeController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val c: zombiezite.controller.ControllerInterface = ZombieZiteApp.getController()

  def about() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.About())
  }

  def index() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.index())
  }

  def newGame(num: String) = Action { implicit request: Request[AnyContent] =>
    c.init(Integer.parseInt(num))
    Ok(views.html.ZombieZite(c))
  }

  def callWait() = Action { implicit request: Request[AnyContent] =>
    c.wait(c.actualPlayer)
    Ok(views.html.ZombieZite(c))
  }

  def callSearch() = Action { implicit request: Request[AnyContent] =>
    c.search(c.actualPlayer)
    Ok(views.html.ZombieZite(c))
  }

  def callMove(direction: String) = Action { implicit request: Request[AnyContent] =>
    direction match {
      case "up" => c.move(c.actualPlayer, 0, -1)
      case "down" => c.move(c.actualPlayer, 0, 1)
      case "left" => c.move(c.actualPlayer, -1, 0)
      case "right" => c.move(c.actualPlayer, 1, 0)
    }
    Ok(views.html.ZombieZite(c))
  }

  def attackField(coord: String) = Action { implicit request: Request[AnyContent] =>
    val coordinate = coord.split(",")
    val x = Integer.parseInt(coordinate.apply(0).trim())
    val y = Integer.parseInt(coordinate.apply(1).trim())
    c.attackField(c.actualPlayer, c.area.line(x)(y))
    Ok(views.html.ZombieZite(c))
  }

  /*def getJson() = Action {
    Ok()
  }*/
}

